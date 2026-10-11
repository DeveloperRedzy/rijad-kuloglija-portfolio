// Plain module (not "use client"): the server layout inlines LOADER_SCRIPT, the client Loader reads the same key.

export const LOADER_KEY = "redzy:loaded";

/**
 * Inlined in <head> (app/layout.tsx), so it runs before first paint. The Loader shell is in every page's HTML but
 * hidden unless this marks the document: first visit in the tab, on `/`, without reduced motion. The first paint of
 * a first visit is then already the loader, never content it later covers, and returning visitors never see it.
 * The timeout uncovers the page if the app never boots (the client lands well before it otherwise).
 */
export const LOADER_SCRIPT = `try{var d=document.documentElement;if(location.pathname==="/"&&!sessionStorage.getItem("${LOADER_KEY}")&&!matchMedia("(prefers-reduced-motion: reduce)").matches){d.dataset.loader="on";setTimeout(function(){if(!d.dataset.landed)delete d.dataset.loader},8000)}}catch(e){}`;
