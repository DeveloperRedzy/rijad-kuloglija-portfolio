declare global {
  interface Window { __heroSceneReady?: Promise<void> }
}

/** Marks the page as landed (loader done or skipped) and notifies listeners. */
export function announceLanded(): void {
  document.documentElement.dataset.landed = "true";
  window.dispatchEvent(new CustomEvent("redzy:landed"));
}

export function hasLanded(): boolean {
  return document.documentElement.dataset.landed === "true";
}

export async function readiness(tier: "A" | "B" | "C"): Promise<void> {
  const tasks: Promise<unknown>[] = [document.fonts.ready];
  const poster = document.querySelector<HTMLImageElement>("[data-hero-poster] img");
  if (poster && !poster.complete) {
    tasks.push(new Promise((r) => { poster.addEventListener("load", r, { once: true }); poster.addEventListener("error", r, { once: true }); }));
  } else if (poster) {
    tasks.push(poster.decode().catch(() => undefined));
  }
  if (tier === "A" && window.__heroSceneReady) tasks.push(window.__heroSceneReady.catch(() => undefined));
  await Promise.all(tasks);
}
