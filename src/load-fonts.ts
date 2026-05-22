import { continueRender, delayRender, staticFile } from "remotion";

// Use explicit FontFace loading instead of @font-face + document.fonts.ready.
// In Remotion renders, fonts.ready can resolve before a late-used family/weight
// has been requested, which makes exported frames fall back to system fonts.

if (typeof document !== "undefined" && typeof FontFace !== "undefined") {
  const globalFontStyle = document.createElement("style");
  globalFontStyle.textContent = `
    html, body {
      font-family: 'HC Inter', 'PingFang TC', 'Heiti TC', 'Microsoft JhengHei', sans-serif;
      font-synthesis: weight;
    }

    * {
      font-family: inherit;
    }
  `;
  document.head.appendChild(globalFontStyle);

  const handle = delayRender("Loading fonts");
  const fontSet = document.fonts as FontFaceSet & { add: (font: FontFace) => void };
  let continued = false;

  const finish = () => {
    if (continued) return;
    continued = true;
    continueRender(handle);
  };

  const fontSpecs: Array<{ family: string; file: string; weight: string }> = [
    { family: "HC Inter", file: "fonts/inter-latin-400-normal.woff2", weight: "400" },
    { family: "HC Inter", file: "fonts/inter-latin-600-normal.woff2", weight: "600" },
    { family: "HC Inter", file: "fonts/inter-latin-700-normal.woff2", weight: "700" },
    { family: "HC Inter", file: "fonts/inter-latin-800-normal.woff2", weight: "800" },
    { family: "HC Inter", file: "fonts/inter-latin-900-normal.woff2", weight: "900" },
    { family: "HC JetBrains Mono", file: "fonts/jetbrains-mono-latin-400-normal.woff2", weight: "400" },
    { family: "HC JetBrains Mono", file: "fonts/jetbrains-mono-latin-700-normal.woff2", weight: "700" },
    { family: "HC JetBrains Mono", file: "fonts/jetbrains-mono-latin-800-normal.woff2", weight: "800" },
  ];

  const fontLoad = Promise.allSettled(
    fontSpecs.map(async ({ family, file, weight }) => {
      const font = new FontFace(family, `url("${staticFile(file)}") format("woff2")`, {
        style: "normal",
        weight,
      });
      const loaded = await font.load();
      fontSet.add(loaded);
    }),
  );

  const timeout = new Promise<void>((resolve) => {
    window.setTimeout(resolve, 5000);
  });

  Promise.race([fontLoad, timeout])
    .then(finish)
    .catch((err) => {
      console.error("Failed to load local fonts", err);
      finish();
    });
}
