import type { AppContext, System } from '../core/types';

/**
 * Fully procedural WebAudio. No sample assets, so nothing to download and every
 * cue is parametric by rarity. The audio agent owns the synthesis design.
 */
export function createAudio(ctx: AppContext): System {
  let audio: AudioContext | null = null;
  let master: GainNode | null = null;

  function ensure(): AudioContext | null {
    if (ctx.deterministic) return null; // silent under the shot harness
    if (!audio) {
      audio = new AudioContext();
      master = audio.createGain();
      master.gain.value = 0.35;
      master.connect(audio.destination);
    }
    if (audio.state === 'suspended') void audio.resume();
    return audio;
  }

  function blip(freq: number, dur: number, type: OscillatorType = 'sine'): void {
    const a = ensure();
    if (!a || !master) return;
    const osc = a.createOscillator();
    const g = a.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, a.currentTime);
    g.gain.setValueAtTime(0, a.currentTime);
    g.gain.linearRampToValueAtTime(0.6, a.currentTime + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, a.currentTime + dur);
    osc.connect(g).connect(master);
    osc.start();
    osc.stop(a.currentTime + dur + 0.02);
  }

  window.addEventListener('pointerdown', () => ensure(), { once: true });

  ctx.bus.on('reveal:impact', ({ position }) => {
    blip(220 + position.card.rarity * 110, 0.5 + position.card.rarity * 0.2, 'triangle');
  });
  ctx.bus.on('pull:committed', () => blip(120, 0.35, 'sawtooth'));

  return {
    name: 'audio',
    update() {},
    dispose() {
      void audio?.close();
    },
  };
}
