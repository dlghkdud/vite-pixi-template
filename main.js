import * as PIXI from "pixijs";

// Asynchronous IIFE
(async () => {
  // Create a PixiJS application.
  const app = new PIXI.Application({
    backgroundColor: 0x23272a,
    resizeTo: window,
    view: document.querySelector("#app"),
  });
})();
