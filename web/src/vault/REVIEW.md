# Review standard

The bar is a flagship WebGL site that wins awards. The reviewer's job is to
find the reason it would lose, not to confirm that it is fine. A pass is rare
and must be earned.

## How to review

1. Capture the current state with `tools/shoot.mjs`.
2. Open every PNG and look at it. A review written without opening the images
   is worthless and will be discarded.
3. Score each axis below out of 10. Any axis under 8 fails the whole review.
4. Write defects as specific, actionable, single-cause items naming the file
   that owns them. "Lighting feels off" is not a defect. "The key light at
   src/scene/lighting.ts:22 is at 3.2 intensity with no falloff, so the plinth
   rim reads flat and the shadow terminator is a hard line" is a defect.

## Axes

**Material response.** Do surfaces respond to light like the material they
claim to be? Metal needs an environment to reflect or it reads as grey
plastic. Roughness must vary across a surface. Fresnel must be present at
grazing angles. Foil must shift hue with view angle, not just glow.

**Light and falloff.** Is there a clear key, a considered fill, and a rim that
separates the subject from the background? Does light fall off physically? Are
shadows soft-edged and correctly biased, with no acne and no gap between object
and contact shadow? Contact shadows are the difference between an object
sitting on a surface and floating above it.

**Tone and exposure.** Is the image readable? Are blacks crushed to pure zero
or do they hold detail? Are highlights clipped to flat white? A near-black
frame is not moody, it is unlit. A washed frame is not filmic, it is fogged.

**Volumetrics and gradients.** Any banding at all is a failure. Look at the
haze, the fog, the bloom falloff, and every large soft gradient at full
resolution. Banding means the dither is missing or the precision is wrong.

**Silhouette and composition.** Does the frame have a clear subject? Is the
hero element cropped, centred lazily, or lost against the background? Does the
eye know where to go? Check the framing at 1600x1000 and at portrait.

**Edges and geometry.** Unbevelled edges catch no light and are the loudest
amateur tell. Check every hard corner. Check for z-fighting, for intersecting
geometry, for visible polygon silhouettes on anything meant to read as curved.

**Antialiasing and stability.** Stair-stepped edges, shimmer on high-frequency
detail, and ghosting trails behind moving objects are all failures.

**Typography.** Baseline alignment, optical rather than mathematical centring,
consistent letter-spacing on caps, tabular numerals on every figure, and a
real type scale. Text over the 3D scene must stay legible against both the
darkest and the brightest frame.

**Motion.** Nothing linear. Anticipation before every major move,
follow-through after it, overlapping action on secondary elements, and held
beats that let a moment land. Frame-rate independent. Check that a still of a
key beat has a readable, dynamic pose.

**Coherence.** Do the parts look authored by one person? A beautiful card in a
cheap room fails. A precise UI over a muddy render fails.

## Verdict

State the score per axis, the ranked defects, and one of:

- `FAIL` with the defect list, routed to the owning agent.
- `PASS` only if you would put the frame in a portfolio under your own name.

When a reference is available, also state, for each blind sheet, which panel is
better and specifically why. Do not open the key file. Guessing which panel is
ours defeats the purpose of the test.
