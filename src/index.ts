import { registerRoot } from "remotion";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadNotoTC } from "@remotion/google-fonts/NotoSansTC";
import { loadFont as loadJetBrains } from "@remotion/google-fonts/JetBrainsMono";
import { RemotionRoot } from "./Root";

loadInter("normal", { weights: ["400", "600", "700", "800", "900"] });
loadNotoTC("normal", { weights: ["400", "500", "700", "900"] });
loadJetBrains("normal", { weights: ["400", "700", "800"] });

registerRoot(RemotionRoot);
