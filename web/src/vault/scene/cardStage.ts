import * as THREE from 'three';
import type { AppContext, CardRecord, System, VaultPosition } from '../core/types';
import { createCardGeometry, createCardMaterial, type CardMaterial } from '../materials';
import { registerShot } from '../core/harness';
import { choreoFor, STAGE, type AnimBeat, type Choreo } from '../anim/choreography';
import { Timeline, Track, type Key } from '../anim/timeline';
import { clamp01, mix, cubicIn, cubicOut, quadIn, quadOut, expoOut, linear, EASE } from '../anim/easing';
import { SpringVec3, stepSpring, stepSpringQuat, makeSpring } from '../anim/spring';
import { fbm1, noise1, seedFrom, hash11 } from '../anim/noise';
import { PhysicsWorld } from '../physics/world';
import { RigidBody } from '../physics/rigidbody';
import { CARD_AERO } from '../physics/aero';

/**
 * The pack opening.
 *
 * Six beats, cut against the bus events the gacha machine emits:
 *
 *   idle    sealed packet under containment, breathing, never still, never busy
 *   charge  the seal winds up, the packet compresses, then a dead beat
 *   burst   the packet tears and the card is ejected as a real rigid body
 *   impact  it lands on the plinth with weight, and the camera takes the hit
 *   turn    the hero move: the card rises and turns its face to the lens
 *   settle  a readable hero pose with continuing secondary motion
 *
 * The machine's events unlock beats; they never dictate the tempo. Under the
 * harness all four events arrive on the same frame, and the sequence still plays
 * at its authored length because each beat advances on its own clock and only
 * checks whether the next one has been unlocked. That is also what lets a shot
 * park mid sequence: withhold an event and the choreography holds its pose.
 *
 * The card is a genuine thin plate rigid body during the burst: correct box
 * inertia, plate aerodynamics with a centre of pressure that runs ahead of the
 * centre of mass (which is the whole reason a card flutters instead of dropping
 * like a brick), impulse contacts against the plinth, and explicit sleeping so
 * it is dead still once it lands.
 */

const CARD_H = 0.62;
const CARD_W = CARD_H * (63 / 88);
const CARD_T = 0.0042;

const PACKET_W = 0.44;
const PACKET_H = 0.66;
const SHELL_T = 0.016;
const SHELL_Z = 0.016;

const TAU = Math.PI * 2;

const _v = new THREE.Vector3();
const _v2 = new THREE.Vector3();
const _q = new THREE.Quaternion();
const _q2 = new THREE.Quaternion();
const _euler = new THREE.Euler();

export function createCardStage(ctx: AppContext): System {
  const { bus } = ctx;

  const root = new THREE.Group();
  root.name = 'card-stage';
  ctx.scene.add(root);

  const disposables: Array<{ dispose(): void }> = [];
  const keep = <T extends { dispose(): void }>(x: T): T => {
    disposables.push(x);
    return x;
  };

  // --- materials ------------------------------------------------------------
  // The real card surface: thin film foil, a printed face composed from the
  // card's own record, and a rolled edge showing the laminate core. Materials
  // are reference counted per card, so the stage takes one for whichever card is
  // currently in play and releases it when another takes over.
  let cardMat: CardMaterial | null = null;
  let faceMat: THREE.MeshPhysicalMaterial | null = null;
  let backMat: THREE.MeshPhysicalMaterial | null = null;

  /**
   * Point the card mesh at `record`'s surface. Composing a face is roughly 40 ms
   * of canvas work, so this runs at the top of the charge beat while the packet
   * is still sealed, never on the reveal frame itself.
   */
  function useCardMaterial(record: CardRecord): void {
    if (cardMat && cardMat.card.id === record.id) return;
    const previous = cardMat;
    cardMat = createCardMaterial(record, ctx);
    card.material = cardMat.materials;
    faceMat = cardMat.front;
    backMat = cardMat.back;
    // Release after assigning, so a shared program is never dropped to zero
    // references and recompiled between two cards of the same rarity and type.
    previous?.release();
  }

  const foilMat = keep(
    new THREE.MeshPhysicalMaterial({
      color: 0x0a0e1c,
      roughness: 0.31,
      metalness: 0.96,
      clearcoat: 1,
      clearcoatRoughness: 0.14,
      transparent: true,
      opacity: 1,
    })
  );
  const crimpMat = keep(
    new THREE.MeshPhysicalMaterial({
      color: 0x1b2138,
      roughness: 0.42,
      metalness: 0.88,
      transparent: true,
      opacity: 1,
    })
  );
  const seamMat = keep(
    new THREE.MeshStandardMaterial({
      color: 0x05070c,
      emissive: new THREE.Color(0x9fb6d8),
      emissiveIntensity: 1.2,
      roughness: 0.5,
      metalness: 0,
    })
  );
  const edgeGlowMat = keep(
    new THREE.MeshStandardMaterial({
      color: 0x05070c,
      emissive: new THREE.Color(0x9fb6d8),
      emissiveIntensity: 0.5,
      roughness: 0.6,
      metalness: 0,
    })
  );
  const coreMat = keep(
    new THREE.MeshBasicMaterial({
      color: 0x9fb6d8,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
  );

  // --- packet ---------------------------------------------------------------
  const packet = new THREE.Group();
  packet.position.set(0, STAGE.packetY, 0);
  root.add(packet);

  /** Inner node carrying squash and tremor so it never fights the packet pose. */
  const flex = new THREE.Group();
  packet.add(flex);

  const shellGeo = keep(new THREE.BoxGeometry(PACKET_W, PACKET_H, SHELL_T));
  const shellFront = new THREE.Mesh(shellGeo, foilMat);
  shellFront.position.z = SHELL_Z;
  const shellBack = new THREE.Mesh(shellGeo, foilMat);
  shellBack.position.z = -SHELL_Z;
  for (const s of [shellFront, shellBack]) {
    s.castShadow = true;
    s.receiveShadow = true;
    flex.add(s);
  }

  const crimpGeo = keep(new THREE.BoxGeometry(PACKET_W * 1.05, 0.044, SHELL_Z * 2 + SHELL_T * 1.6));
  const crimpTop = new THREE.Mesh(crimpGeo, crimpMat);
  crimpTop.position.y = PACKET_H / 2 + 0.006;
  const crimpBottom = new THREE.Mesh(crimpGeo, crimpMat);
  crimpBottom.position.y = -PACKET_H / 2 - 0.006;
  for (const c of [crimpTop, crimpBottom]) {
    c.castShadow = true;
    flex.add(c);
  }

  const seamGeo = keep(new THREE.BoxGeometry(PACKET_W * 1.06, 0.009, SHELL_Z * 2 + SHELL_T * 1.7));
  const seam = new THREE.Mesh(seamGeo, seamMat);
  seam.position.y = PACKET_H / 2 - 0.052;
  flex.add(seam);

  const edgeGeo = keep(new THREE.BoxGeometry(0.009, PACKET_H * 0.9, SHELL_Z * 2 + SHELL_T * 1.5));
  const edgeL = new THREE.Mesh(edgeGeo, edgeGlowMat);
  edgeL.position.x = -PACKET_W / 2 - 0.002;
  const edgeR = new THREE.Mesh(edgeGeo, edgeGlowMat);
  edgeR.position.x = PACKET_W / 2 + 0.002;
  flex.add(edgeL, edgeR);

  const coreGeo = keep(new THREE.PlaneGeometry(PACKET_W * 0.84, PACKET_H * 0.86));
  const core = new THREE.Mesh(coreGeo, coreMat);
  core.position.z = SHELL_Z - SHELL_T * 0.5 - 0.001;
  flex.add(core);

  // --- card -----------------------------------------------------------------
  // Swept profile rather than a box: the rolled corner and the cut edge showing
  // the printed core are what stop it reading as a textured rectangle.
  const cardGeo = keep(createCardGeometry({ height: CARD_H }));
  // Materials arrive with the first card; the mesh is hidden until then.
  const card = new THREE.Mesh(cardGeo, [] as THREE.Material[]);
  card.castShadow = true;
  card.receiveShadow = true;
  card.visible = false;
  root.add(card);

  // --- debris ---------------------------------------------------------------
  // Three torn pieces of packet, spawned at the shells' world poses on the burst
  // and integrated ballistically. Cheap, and the follow through matters: the
  // packet must not simply vanish at the moment of the tear.
  interface Debris {
    mesh: THREE.Mesh;
    body: RigidBody;
    source: THREE.Object3D;
    kick: THREE.Vector3;
  }
  const debrisMat = keep(foilMat.clone());
  debrisMat.transparent = true;
  const debris: Debris[] = [
    { source: shellFront, kick: new THREE.Vector3(0.85, 1.35, 1.5) },
    { source: shellBack, kick: new THREE.Vector3(-0.9, 1.2, -1.35) },
    { source: crimpTop, kick: new THREE.Vector3(0.2, 3.1, 0.55) },
  ].map((d) => {
    const mesh = new THREE.Mesh(d.source === crimpTop ? crimpGeo : shellGeo, debrisMat);
    mesh.castShadow = true;
    mesh.visible = false;
    root.add(mesh);
    return {
      mesh,
      source: d.source,
      kick: d.kick,
      body: new RigidBody({
        mass: d.source === crimpTop ? 0.004 : 0.012,
        size: new THREE.Vector3(PACKET_W, PACKET_H, SHELL_T),
        linearDamping: 0.9,
        angularDamping: 0.6,
      }),
    };
  });
  let debrisTime = 0;
  let debrisActive = false;

  // --- physics --------------------------------------------------------------
  const world = new PhysicsWorld();
  const cardBody = new RigidBody({
    // Areal density of real card stock is about 0.33 kg/m^2. At this card's
    // scale that is 90 g. Using the real areal density rather than a real card's
    // total mass is what makes the fall behave like card stock: same terminal
    // velocity, longer and more readable flutter period.
    mass: 0.09,
    size: new THREE.Vector3(CARD_W, CARD_H, CARD_T),
    linearDamping: 0.05,
    angularDamping: 0.12,
    restitution: 0.24,
    friction: 0.62,
  });
  cardBody.active = false;
  world.add(cardBody, { aero: CARD_AERO });
  world.addPlane({
    id: 'plinth',
    normal: new THREE.Vector3(0, 1, 0),
    offset: STAGE.plinthTop,
    radius: STAGE.plinthRadius,
    center: new THREE.Vector3(0, 0, 0),
    restitution: 0.3,
    friction: 0.7,
  });
  world.addPlane({
    id: 'floor',
    normal: new THREE.Vector3(0, 1, 0),
    offset: 0.002,
    restitution: 0.2,
    friction: 0.85,
  });

  // --- sequence state -------------------------------------------------------
  let beat: AnimBeat = 'idle';
  let beatTime = 0;
  let beatDur = 0;
  /**
   * The stage's own clock. Everything that drives continuous motion reads this
   * rather than `FrameTime.elapsed`, so the shot harness can fast forward the
   * whole sequence inside a single real frame and the noise phase stays
   * continuous across the seam.
   */
  let animClock = 0;
  let choreo: Choreo = choreoFor(0);
  let rarity = 0;
  let seqSeed = 1;
  let currentIndex = -1;
  let hero: VaultPosition | null = null;
  let landed = false;

  const unlocked = { charge: false, burst: false, turn: false, settle: false };

  const chargeTl = new Timeline(1);
  const turnTl = new Timeline(1);
  let turnRot: Track = new Track([{ t: 0, v: 0 }]);
  let turnLift: Track = new Track([{ t: 0, v: 0 }]);
  let turnSpin: Track = new Track([{ t: 0, v: 0 }]);

  const turnFrom = new THREE.Vector3();
  const turnFromQ = new THREE.Quaternion();
  const turnCtrl = new THREE.Vector3();
  const heroQ = new THREE.Quaternion().setFromEuler(new THREE.Euler(-0.045, 0.115, 0.018, 'YXZ'));

  const settlePos = new SpringVec3(STAGE.heroPos);
  const settleQ = new THREE.Quaternion().copy(heroQ);
  const settleW = new THREE.Vector3();
  const glowSpring = makeSpring(0.35);
  const packetPos = new SpringVec3(new THREE.Vector3(0, STAGE.packetY, 0));

  const posePayload: { x: number; y: number; z: number; speed: number } = {
    x: 0,
    y: STAGE.packetY,
    z: 0,
    speed: 0,
  };
  const lastPose = new THREE.Vector3(0, STAGE.packetY, 0);

  /**
   * Transition log, published so shot settle frames can be tuned against the real
   * simulated timing instead of guessed. Bounded, and read by tooling only.
   */
  const beatLog: Array<{ beat: AnimBeat; at: number; y: number; vy: number }> = [];
  (window as unknown as Record<string, unknown>).__animBeats = beatLog;

  const r3 = (x: number) => Math.round(x * 1000) / 1000;

  function setBeat(next: AnimBeat, duration: number): void {
    beat = next;
    beatTime = 0;
    beatDur = duration;
    if (beatLog.length < 64) {
      beatLog.push({
        beat: next,
        at: r3(animClock),
        y: r3(cardBody.position.y),
        vy: r3(cardBody.velocity.y),
      });
    }
    bus.emit('anim:beat', { beat: next, rarity, duration, offset: 0 });
  }

  /** Re-broadcast the current beat with how far into it the sequence already is. */
  function resync(): void {
    bus.emit('anim:beat', { beat, rarity, duration: beatDur, offset: beatTime });
  }

  // The impact beat is triggered by a real contact, not a timer. Anything past a
  // gentle touch during the flight counts as the landing.
  const contactLog: unknown[] = [];
  (window as unknown as Record<string, unknown>).__animContacts = contactLog;
  world.contacts((c) => {
    if (contactLog.length < 20) {
      contactLog.push({
        p: c.planeId,
        s: r3(c.speed),
        y: r3(c.point.y),
        by: r3(cardBody.position.y),
        at: r3(animClock),
        b: beat,
      });
    }
    if (beat === 'burst' && c.speed > 0.35) landed = true;
  });

  function resetSequence(): void {
    beat = 'idle';
    beatTime = 0;
    landed = false;
    currentIndex = -1;
    unlocked.charge = false;
    unlocked.burst = false;
    unlocked.turn = false;
    unlocked.settle = false;
    card.visible = false;
    cardBody.active = false;
    cardBody.sleeping = false;
    packet.visible = true;
    flex.scale.set(1, 1, 1);
    flex.position.set(0, 0, 0);
    flex.rotation.set(0, 0, 0);
    packet.position.set(0, STAGE.packetY, 0);
    packetPos.snap(packet.position);
    debrisActive = false;
    for (const d of debris) d.mesh.visible = false;
    beatLog.length = 0;
    beatDur = 0;
    bus.emit('anim:beat', { beat: 'idle', rarity, duration: 0, offset: 0 });
  }

  function tint(color: THREE.Color): void {
    seamMat.emissive.copy(color);
    edgeGlowMat.emissive.copy(color);
    coreMat.color.copy(color);
    faceMat?.emissive.copy(color);
    backMat?.emissive.copy(color);
  }

  function beginSequence(position: VaultPosition, index: number): void {
    rarity = position.card.rarity;
    choreo = choreoFor(rarity);
    hero = position;
    currentIndex = index;
    seqSeed = seedFrom(position.card.id, index, rarity);
    // Compose this card's surface now, during the sealed charge beat.
    useCardMaterial(position.card);
    tint(choreo.color);

    landed = false;
    unlocked.charge = true;
    unlocked.burst = false;
    unlocked.turn = false;
    unlocked.settle = false;
    card.visible = false;
    cardBody.active = false;
    cardBody.sleeping = false;
    packet.visible = true;
    debrisActive = false;
    for (const d of debris) d.mesh.visible = false;

    buildChargeTimeline();
    setBeat('charge', choreo.chargeDur + choreo.holdDur);
    bus.emit('audio:cue', { id: 'packet-charge', intensity: clamp01(rarity / 4) });
  }

  /**
   * The wind up, authored against the split between the visible charge and the
   * dead beat that follows it. The tremor climbs, then is cut to almost nothing
   * for the hold; the glow ramps, dips on the intake of breath, then floods.
   * That dip is the reason the burst lands.
   */
  function buildChargeTimeline(): void {
    const total = choreo.chargeDur + choreo.holdDur;
    const hs = clamp01(choreo.chargeDur / total);
    const squash: Key[] = [
      { t: 0, v: 0, ease: EASE.charge },
      { t: hs, v: 1, ease: linear },
      { t: 1, v: 1 },
    ];
    const tremor: Key[] = [
      { t: 0, v: 0, ease: quadIn },
      { t: hs * 0.86, v: 1, ease: expoOut },
      { t: hs, v: 0.08, ease: quadOut },
      { t: 1, v: 0.03 },
    ];
    const glow: Key[] = [
      { t: 0, v: 0, ease: cubicIn },
      { t: hs * 0.9, v: 0.88, ease: quadOut },
      { t: hs, v: 0.42, ease: cubicIn },
      { t: 1, v: 1.15 },
    ];
    const face: Key[] = [
      { t: 0, v: 0, ease: EASE.glide },
      { t: hs * 0.8, v: 1, ease: linear },
      { t: 1, v: 1 },
    ];
    chargeTl
      .reset(total)
      .track('squash', squash)
      .track('tremor', tremor)
      .track('glow', glow)
      .track('face', face);
  }

  function burst(): void {
    // Card leaves along the packet's own up axis, so the ejection reads as coming
    // out of the pouch rather than out of the world.
    packet.updateMatrixWorld(true);
    flex.updateMatrixWorld(true);
    card.position.copy(packet.position);
    card.quaternion.copy(packet.quaternion);
    cardBody.readFrom(packet.position, packet.quaternion);
    cardBody.active = true;
    card.visible = true;

    const r1 = hash11(seqSeed ^ 0x1f);
    const r2 = hash11(seqSeed ^ 0x2b);
    const r3 = hash11(seqSeed ^ 0x3d);
    const r4 = hash11(seqSeed ^ 0x4c);

    _v.set(0, 1, 0).applyQuaternion(packet.quaternion).multiplyScalar(choreo.ejectSpeed);
    _v.z += choreo.ejectForward;
    _v.x += r1 * 0.16;
    cardBody.velocity.copy(_v);

    // Tumble dominated by pitch: a card thrown from a pouch turns end over end,
    // and end over end is also the axis that reads best from this camera.
    cardBody.angularVelocity.set(
      -choreo.ejectSpin * (0.78 + 0.22 * Math.abs(r2)),
      choreo.ejectSpin * 0.26 * r3,
      choreo.ejectSpin * 0.14 * r4
    );

    // Torn packet.
    for (const d of debris) {
      d.source.updateMatrixWorld(true);
      d.source.matrixWorld.decompose(d.mesh.position, d.mesh.quaternion, d.mesh.scale);
      d.mesh.visible = true;
      d.body.readFrom(d.mesh.position, d.mesh.quaternion);
      d.body.velocity.copy(d.kick).multiplyScalar(0.55 + 0.45 * choreo.ejectSpeed * 0.28);
      d.body.angularVelocity.set(r1 * 9 + 3, r2 * 7, r3 * 11);
    }
    debrisActive = true;
    debrisTime = 0;
    packet.visible = false;
    debrisMat.opacity = 1;

    bus.emit('camera:shake', { amount: choreo.burstShake, duration: choreo.shakeDur * 0.55 });
    bus.emit('audio:cue', { id: 'packet-burst', intensity: clamp01(0.4 + rarity / 5) });
    setBeat('burst', choreo.maxFlight);
  }

  function enterImpact(): void {
    bus.emit('camera:shake', { amount: choreo.impactShake, duration: choreo.shakeDur });
    bus.emit('audio:cue', { id: 'card-impact', intensity: clamp01(0.3 + rarity / 4) });
    setBeat('impact', choreo.impactHold);
  }

  function enterTurn(): void {
    cardBody.active = false;
    turnFrom.copy(cardBody.position);
    turnFromQ.copy(cardBody.quaternion);

    // Arc the lift so the card sweeps up into frame rather than sliding there.
    turnCtrl
      .copy(turnFrom)
      .add(STAGE.heroPos)
      .multiplyScalar(0.5)
      .add(_v.set(0, choreo.liftArc, 0.06));

    turnRot = new Track(choreo.turnKeys);
    turnLift = new Track(choreo.liftKeys);
    turnSpin = new Track(choreo.spinKeys);
    turnTl.reset(choreo.turnDur);

    bus.emit('audio:cue', { id: 'reveal-turn', intensity: clamp01(0.3 + rarity / 4) });
    setBeat('turn', choreo.turnDur);
  }

  function enterSettle(): void {
    settlePos.snap(card.position);
    settleQ.copy(card.quaternion);
    settleW.set(0, 0, 0);
    bus.emit('audio:cue', { id: 'reveal-settled', intensity: clamp01(0.3 + rarity / 4) });
    setBeat('settle', 0);
  }

  // --- bus ------------------------------------------------------------------
  bus.on('pull:committed', ({ positions }) => {
    if (positions.length > 0) beginSequence(positions[0], 0);
  });

  bus.on('reveal:start', ({ position, index }) => {
    if (beat === 'idle' || index !== currentIndex) beginSequence(position, index);
    unlocked.burst = true;
  });

  bus.on('reveal:impact', () => {
    unlocked.turn = true;
  });

  bus.on('reveal:settled', ({ position }) => {
    hero = position;
    unlocked.settle = true;
  });

  bus.on('pull:complete', () => {
    unlocked.settle = true;
  });

  // --- per beat visuals -----------------------------------------------------

  function updateIdle(dt: number): void {
    const elapsed = animClock;
    // Two slow oscillators at incommensurate rates plus low frequency noise, so
    // the loop never visibly repeats and the packet never sits dead.
    const bob = Math.sin(elapsed * 0.83) * 0.014 + fbm1(elapsed * 0.19, 3) * 0.009;
    const pressure = 0.5 + 0.5 * Math.sin(elapsed * 1.06);

    _v.set(0, STAGE.packetY + bob, 0);
    packetPos.step(_v, 3.4, dt);
    packet.position.copy(packetPos.value);

    _euler.set(
      0.055 + fbm1(elapsed * 0.11, 19) * 0.035,
      -0.34 + fbm1(elapsed * 0.13, 7) * 0.24,
      0.028 + fbm1(elapsed * 0.09, 41) * 0.02,
      'YXZ'
    );
    _q.setFromEuler(_euler);
    packet.quaternion.slerp(_q, 1 - Math.exp(-2.2 * dt));

    // Contained pressure: the pouch swells very slightly against the seal.
    const s = 1 + pressure * 0.006;
    flex.scale.set(s, 1 - pressure * 0.009, s);
    flex.position.set(0, 0, 0);
    flex.rotation.set(0, 0, 0);

    stepSpring(glowSpring, 0.3 + pressure * 0.45, 4, dt);
  }

  function updateCharge(dt: number): void {
    const elapsed = animClock;
    chargeTl.advance(dt);
    const sq = chargeTl.value('squash');
    const tr = chargeTl.value('tremor');
    const gl = chargeTl.value('glow');
    const fc = chargeTl.value('face');

    // Compress, sink toward the plinth, and square up to the camera.
    flex.scale.set(1 + 0.082 * sq, 1 - 0.15 * sq, 1 + 0.082 * sq);

    _v.set(0, STAGE.packetY - 0.06 * sq, 0);
    packetPos.step(_v, 9, dt);
    packet.position.copy(packetPos.value);

    _euler.set(mix(0.055, -0.01, fc), mix(-0.34, -0.08, fc), mix(0.028, 0, fc), 'YXZ');
    _q.setFromEuler(_euler);
    packet.quaternion.slerp(_q, 1 - Math.exp(-6 * dt));

    // Tremor: high frequency, deterministic, and cut to nothing for the hold.
    const a = tr * 0.014;
    flex.position.set(
      noise1(elapsed * 47.3, seqSeed) * a,
      noise1(elapsed * 53.1, seqSeed + 11) * a * 0.7,
      noise1(elapsed * 41.7, seqSeed + 23) * a * 0.5
    );
    flex.rotation.set(
      noise1(elapsed * 44.9, seqSeed + 31) * tr * 0.03,
      noise1(elapsed * 39.3, seqSeed + 47) * tr * 0.04,
      noise1(elapsed * 51.7, seqSeed + 59) * tr * 0.03
    );

    stepSpring(glowSpring, 0.35 + gl * choreo.glow * 3.4, 14, dt);
  }

  function updateTurn(dt: number): void {
    turnTl.advance(dt);
    const u = turnTl.u;
    const rot = turnRot.at(u);
    const lift = turnLift.at(u);
    const spin = turnSpin.at(u);

    quadBezier(turnFrom, turnCtrl, STAGE.heroPos, lift, card.position);

    _q.slerpQuaternions(turnFromQ, heroQ, Math.min(rot, 1.04));
    if (choreo.spinTurns > 0 && spin > 1e-4) {
      // Extra revolutions about the card's own up axis, decaying to zero. This is
      // what rakes the foil across the key light through the middle of the turn.
      _q2.setFromAxisAngle(_v.set(0, 1, 0), spin * choreo.spinTurns * TAU);
      _q.multiply(_q2);
    }
    card.quaternion.copy(_q);

    stepSpring(glowSpring, mix(choreo.glow * 1.6, choreo.glow * 0.5, u), 3, dt);
  }

  function updateSettle(dt: number): void {
    const elapsed = animClock;
    // Continuing motion: a slow float plus a lazy tilt, both noise driven so the
    // hero pose reads as suspended rather than parked.
    const drift = fbm1(elapsed * 0.21, 71, 3);
    _v.copy(STAGE.heroPos);
    _v.y += Math.sin(elapsed * 0.72) * 0.012 + drift * 0.006;
    _v.x += fbm1(elapsed * 0.17, 131, 2) * 0.008;
    settlePos.step(_v, 2.6, dt);
    card.position.copy(settlePos.value);

    _euler.set(
      -0.045 + fbm1(elapsed * 0.15, 211, 2) * 0.03,
      0.115 + Math.sin(elapsed * 0.41) * 0.055,
      0.018 + fbm1(elapsed * 0.13, 307, 2) * 0.018,
      'YXZ'
    );
    _q.setFromEuler(_euler);
    stepSpringQuat(settleQ, settleW, _q, 2.4, dt);
    card.quaternion.copy(settleQ);

    stepSpring(glowSpring, choreo.glow * 0.45, 2, dt);
  }

  function updateDebris(dt: number): void {
    debrisTime += dt;
    const fade = 1 - clamp01((debrisTime - 0.22) / 0.55);
    debrisMat.opacity = cubicOut(fade);
    for (const d of debris) {
      d.body.force.addScaledVector(world.gravity, d.body.mass);
      d.body.integrate(dt);
      d.body.writeTo(d.mesh);
    }
    if (fade <= 0) {
      debrisActive = false;
      for (const d of debris) d.mesh.visible = false;
    }
  }

  // --- shots ----------------------------------------------------------------
  // The machine publishes its vault on window before the HUD constructs; the
  // stage only needs a record with a rarity, and falls back to a synthetic one so
  // a shot never depends on construction order.
  function pickPosition(r: number): VaultPosition {
    const m = (window as unknown as { __machine?: { positions: VaultPosition[] } }).__machine;
    const found = m?.positions.find((p) => p.card.rarity === r);
    if (found) return found;
    return {
      card: {
        id: 1000 + r,
        name: 'SEALED',
        host: 'vault',
        urlHash: '0',
        hp: 0,
        attack: 0,
        speed: 0,
        typeId: 0,
        rarity: r,
        priceUsd: '0',
        latencyMs: 0,
        alive: true,
        network: 'base',
      },
      backing: 1,
      weight: 1,
      standingBid: 1,
    };
  }

  /**
   * Drive the sequence to a chosen moment.
   *
   * `unlock` decides which beats are reachable: withholding an event parks the
   * choreography at the end of a beat, which is how `charging` holds full
   * compression indefinitely. `preroll` seconds are simulated instantly, and the
   * remaining `settleFrames` are rendered so springs, shake decay and secondary
   * motion are all live in the captured frame rather than frozen mid seek.
   */
  function driveShot(
    r: number,
    unlock: { start?: boolean; impact?: boolean; settled?: boolean },
    preroll: number
  ): void {
    resetSequence();
    beginSequence(pickPosition(r), 0);
    if (unlock.start) unlocked.burst = true;
    if (unlock.impact) unlocked.turn = true;
    if (unlock.settled) unlocked.settle = true;
    fastForward(preroll);
  }

  const ALL = { start: true, impact: true, settled: true };
  const RENDERED = 34 / 60; // seconds of real rendered settling in every shot

  registerShot('idle', {
    apply: () => {
      resetSequence();
      fastForward(2.4); // let the breathing loop get away from its start phase
    },
    settleFrames: 34,
  });

  registerShot('charging', {
    // Legendary wind up, parked at full compression on the dead beat, which is
    // the peak of the anticipation and the frame worth reviewing.
    apply: () => driveShot(4, {}, 2.45 - RENDERED),
    settleFrames: 34,
  });

  registerShot('burst', {
    // Just after the tear: card off the plinth, packet shrapnel still in frame.
    apply: () => driveShot(4, { start: true }, 2.33 - RENDERED),
    settleFrames: 34,
  });

  registerShot('reveal-turn', {
    // Deep into the hero turn, on the held plateau where the face has raked
    // around to the key light but has not squared up yet.
    apply: () => driveShot(4, ALL, 4.02 - RENDERED),
    settleFrames: 34,
  });

  registerShot('settled-legendary', {
    apply: () => driveShot(4, ALL, 6.0 - RENDERED),
    settleFrames: 34,
  });

  registerShot('settled-common', {
    apply: () => driveShot(0, ALL, 3.2 - RENDERED),
    settleFrames: 34,
  });

  // Kept so existing capture scripts that ask for `hero` still resolve; it is the
  // same terminal pose as `settled-legendary`.
  registerShot('hero', {
    apply: () => driveShot(4, ALL, 6.0 - RENDERED),
    settleFrames: 34,
  });

  // --- system ---------------------------------------------------------------
  function tick(dt: number): void {
    {
      const t = { dt };
      animClock += dt;
      beatTime += dt;

      switch (beat) {
        case 'idle':
          updateIdle(t.dt);
          break;

        case 'charge':
          updateCharge(t.dt);
          if (chargeTl.done && unlocked.burst) burst();
          break;

        case 'burst':
          world.step(t.dt);
          cardBody.writeTo(card);
          if (landed || beatTime > choreo.maxFlight) enterImpact();
          break;

        case 'impact':
          world.step(t.dt);
          cardBody.writeTo(card);
          if (beatTime > choreo.impactHold && unlocked.turn) enterTurn();
          break;

        case 'turn':
          updateTurn(t.dt);
          if (turnTl.done && unlocked.settle) enterSettle();
          break;

        case 'settle':
          updateSettle(t.dt);
          break;
      }

      if (debrisActive) updateDebris(t.dt);

      // Emissive levels follow one spring so the packet, the seal and the card
      // never disagree about how hot the moment is.
      const g = glowSpring.value;
      seamMat.emissiveIntensity = 0.5 + g * 2.4;
      edgeGlowMat.emissiveIntensity = 0.18 + g * 0.9;
      coreMat.opacity = clamp01(0.18 + g * 0.35);
      if (faceMat) faceMat.emissiveIntensity = 0.06 + clamp01(g) * 0.22;
      if (backMat) backMat.emissiveIntensity = 0.03 + clamp01(g) * 0.12;

      if (cardMat) {
        // The foil charges through the turn and takes the impact punch, so the
        // interference is at its widest exactly when the face meets the lens.
        cardMat.setReveal(beat === 'turn' || beat === 'settle' ? clamp01(g) : 0);
        cardMat.setSurge(clamp01(g * 0.8));
      }

      // Publish the current subject so the camera can track it and the DOF pass
      // can focus on where the card actually is.
      const subject = beat === 'idle' || beat === 'charge' ? packet.position : card.position;
      posePayload.speed = lastPose.distanceTo(subject) / Math.max(t.dt, 1e-4);
      lastPose.copy(subject);
      posePayload.x = subject.x;
      posePayload.y = subject.y;
      posePayload.z = subject.z;
      bus.emit('card:pose', posePayload);

      void hero;
    }
  }

  /**
   * Advance the whole sequence inside a single real frame.
   *
   * Software rendering runs at a few frames per second, so waiting out a five
   * second legendary in rendered frames is not viable for the shot harness. The
   * simulation is pure and fixed step, so stepping it here produces exactly the
   * state the rendered path would have reached, at zero render cost. The trailing
   * `resync` tells the camera rig to snap rather than ease, because a seek is not
   * a camera move.
   */
  function fastForward(seconds: number): void {
    const steps = Math.max(0, Math.round(seconds * 60));
    for (let i = 0; i < steps; i++) tick(1 / 60);
    resync();
  }

  return {
    name: 'card-stage',

    update(t) {
      tick(t.dt);
      // Drives the travelling interference term; must run every frame or the
      // foil is a static rainbow rather than a moving one.
      cardMat?.update(t);
    },

    dispose() {
      ctx.scene.remove(root);
      cardMat?.release();
      cardMat = null;
      for (const d of disposables) d.dispose();
    },
  };

  // --- helpers --------------------------------------------------------------

  function quadBezier(
    p0: THREE.Vector3,
    p1: THREE.Vector3,
    p2: THREE.Vector3,
    t: number,
    out: THREE.Vector3
  ): THREE.Vector3 {
    const mt = 1 - t;
    out.set(0, 0, 0)
      .addScaledVector(p0, mt * mt)
      .addScaledVector(p1, 2 * mt * t)
      .addScaledVector(p2, t * t);
    return out;
  }
}
