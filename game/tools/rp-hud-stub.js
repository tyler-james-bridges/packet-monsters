// Temporary stand-in for src/ui/hud.ts while that file is mid-rewrite by the UI
// agent and throws a temporal dead zone error at construction. The HUD is a DOM
// overlay and never touches the render pipeline, so swapping it out changes
// nothing about what the post chain is being judged on.
export function createHud() {
  return {
    name: 'hud-stub',
    update() {},
    resize() {},
    dispose() {},
  };
}
