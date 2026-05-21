import { FPS } from "./tokens";

export interface SubtitleEntry {
  from: number;
  to: number;
  text: string;
}

const s = (sec: number) => Math.round(sec * FPS);

export const SUBTITLES: SubtitleEntry[] = [
  { from: s(2), to: s(4), text: "HireCook 真才實測 · 讓他煮" },
  { from: s(5), to: s(9), text: "給 30–150 人成長型中小企業" },
  { from: s(10), to: s(14), text: "別再只靠履歷、測驗與主管直覺" },
  { from: s(15), to: s(22), text: "60.3 天招募空窗，65.4% 半年留任" },
  { from: s(23), to: s(32), text: "單次錯配損失 NT$ 20–30 萬" },
  { from: s(35), to: s(43), text: "人格不等於工作表現" },
  { from: s(44), to: s(53), text: "行為，是人格與環境交互作用的結果" },
  { from: s(54), to: s(68), text: "HireCook 模擬壓力情境，預測真實工作反應" },
  { from: s(72), to: s(80), text: "D-I-T：定義環境、互動測驗、產出手冊" },
  { from: s(82), to: s(101), text: "Define：主管拖曳滑桿，建立職位環境模型" },
  { from: s(104), to: s(124), text: "Interact：候選人在限時情境題中做出選擇" },
  { from: s(127), to: 8580, text: "Tailor：系統產出 TAT 人才使用手冊" },
  { from: s(151) - 470, to: s(164) - 470, text: "HireCook 不是取代 HR，而是升級決策" },
  { from: s(167) - 470, to: s(179) - 470, text: "降低人才錯配，加入企業種子驗證計畫" },
];
