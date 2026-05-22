import { staticFile } from "remotion";

const fontFace = (family: string, file: string, weight: number) => `
  @font-face {
    font-family: '${family}';
    src: url('${staticFile(file)}') format('woff2');
    font-weight: ${weight};
    font-style: normal;
    font-display: block;
  }
`;

const fontFaces = (family: string, file: string, weights: number[]) =>
  weights.map((weight) => fontFace(family, file, weight)).join("\n");

if (typeof document !== "undefined") {
  const globalFontStyle = document.createElement("style");
  globalFontStyle.textContent = `
    ${fontFaces("HC Inter", "fonts/inter-latin-400-normal.woff2", [400])}
    ${fontFaces("HC Inter", "fonts/inter-latin-600-normal.woff2", [500, 600, 650, 680])}
    ${fontFaces("HC Inter", "fonts/inter-latin-700-normal.woff2", [700, 720, 750, 760])}
    ${fontFaces("HC Inter", "fonts/inter-latin-800-normal.woff2", [800, 820, 850])}
    ${fontFaces("HC Inter", "fonts/inter-latin-900-normal.woff2", [900, 920, 950])}

    ${fontFaces("HC JetBrains Mono", "fonts/jetbrains-mono-latin-400-normal.woff2", [400, 500, 600])}
    ${fontFaces("HC JetBrains Mono", "fonts/jetbrains-mono-latin-700-normal.woff2", [650, 700, 720, 750, 760])}
    ${fontFaces("HC JetBrains Mono", "fonts/jetbrains-mono-latin-800-normal.woff2", [800, 820, 850, 900, 920, 950])}

    ${fontFaces("HC Noto Sans TC", "fonts/noto-sans-tc-chinese-traditional-400-normal.woff2", [400, 500])}
    ${fontFaces("HC Noto Sans TC", "fonts/noto-sans-tc-chinese-traditional-700-normal.woff2", [600, 650, 680, 700, 720, 750, 760])}
    ${fontFaces("HC Noto Sans TC", "fonts/noto-sans-tc-chinese-traditional-900-normal.woff2", [800, 820, 850, 900, 920, 950])}

    html, body {
      font-family: 'HC Inter', 'HC Noto Sans TC', 'PingFang TC', 'Heiti TC', 'Microsoft JhengHei', sans-serif;
      font-synthesis: none;
      text-rendering: geometricPrecision;
    }

    * {
      font-family: inherit;
      font-synthesis: none;
    }
  `;
  globalFontStyle.setAttribute("data-hirecook-fonts", "true");
  document.head.appendChild(globalFontStyle);
}
