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

if (typeof document !== "undefined") {
  const globalFontStyle = document.createElement("style");
  globalFontStyle.textContent = `
    ${fontFace("HC Inter", "fonts/inter-latin-400-normal.woff2", 400)}
    ${fontFace("HC Inter", "fonts/inter-latin-600-normal.woff2", 600)}
    ${fontFace("HC Inter", "fonts/inter-latin-700-normal.woff2", 700)}
    ${fontFace("HC Inter", "fonts/inter-latin-800-normal.woff2", 800)}
    ${fontFace("HC Inter", "fonts/inter-latin-900-normal.woff2", 900)}

    ${fontFace("HC JetBrains Mono", "fonts/jetbrains-mono-latin-400-normal.woff2", 400)}
    ${fontFace("HC JetBrains Mono", "fonts/jetbrains-mono-latin-700-normal.woff2", 700)}
    ${fontFace("HC JetBrains Mono", "fonts/jetbrains-mono-latin-800-normal.woff2", 800)}

    ${fontFace("HC Noto Sans TC", "fonts/noto-sans-tc-chinese-traditional-400-normal.woff2", 400)}
    ${fontFace("HC Noto Sans TC", "fonts/noto-sans-tc-chinese-traditional-700-normal.woff2", 700)}
    ${fontFace("HC Noto Sans TC", "fonts/noto-sans-tc-chinese-traditional-900-normal.woff2", 900)}

    html, body {
      font-family: 'HC Inter', 'HC Noto Sans TC', 'PingFang TC', 'Heiti TC', 'Microsoft JhengHei', sans-serif;
      font-synthesis: weight;
    }

    * {
      font-family: inherit;
    }
  `;
  document.head.appendChild(globalFontStyle);
}
