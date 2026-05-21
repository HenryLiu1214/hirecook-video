// SJTAssessment.jsx — Step 2 of the D-I-T flow（繁中版）
const { useState: _sjtState, useEffect: _sjtEff } = React;

const SJT_ITEMS = [
  // ── 廚房情境（高職場同構性）──────────────────────────────────
  {
    id: "k01",
    tag: "廚房 · 截止日碰撞",
    scene: "你負責備餐，傳菜員已在出餐口等待。配菜那端的隊友突然發現食材不夠，開始重備，但沒有開口說。廚師長正在計時，三分鐘後這桌就超時了。",
    prompt: "你第一個動作是——",
    options: [
      "直接接手配菜工作，自己同時備兩個位置。",
      "大聲告訴隊友：「食材不夠我幫你，你去通知廚師長。」",
      "先出一個可以先上的菜穩住桌況，配菜那邊再想辦法。",
      "向廚師長報告有問題，請他決定怎麼調度。"
    ]
  },
  {
    id: "k02",
    tag: "廚房 · 優先順序",
    scene: "廚房同時進了三張訂單：VIP 桌需要 12 分鐘、等了 25 分鐘的普通桌還沒上主菜、10 分鐘就能出的簡單菜。你是今晚的統籌，只有一個爐口是空的。",
    prompt: "你的出菜順序是——",
    options: [
      "VIP 優先，品質代表廚房聲譽。",
      "等最久的桌優先，公平原則不能妥協。",
      "先出最快的菜讓一個桌子安靜下來，再處理另外兩桌。",
      "讓外場主管決定，出菜順序涉及服務策略，不是廚房的事。"
    ]
  },
  {
    id: "k03",
    tag: "廚房 · 交接失誤",
    scene: "你做好一道複雜的主菜，準備交給負責擺盤的隊友，但發現他同時處理兩道甜點，根本沒注意到你。主菜在 5 秒後就涼了。",
    prompt: "你——",
    options: [
      "直接把菜放到他的工作台，讓他看到再說。",
      "大聲喊他的名字，確認他接到指令後才放手。",
      "先保溫，等他手邊的甜點出去再移交。",
      "自己也做擺盤，這次先跨位補位，事後再討論分工。"
    ]
  },
  // ── 真實職場情境 ────────────────────────────────────────────
  {
    id: "s01",
    tag: "職場 · 截止日碰撞",
    scene: "隊友剛推了一個 refactor，讓你除錯了兩小時的整合測試直接 fail。Demo 還有 45 分鐘。他正在 Slack 上打字。",
    prompt: "你第一個動作是——",
    options: [
      "自己 revert 他的 commit，demo 結束後再 ping 他說明。",
      "立刻開 5 分鐘 call，確認誰 revert、誰往前 patch，各就各位。",
      "先讓整合測試 skip，demo 後再補上作為 follow-up。",
      "繼續在自己 branch 除錯，讓他知道 demo 可能會延。"
    ]
  },
  {
    id: "s02",
    tag: "職場 · 模糊需求",
    scene: "主管要你今天結束前給一個功能的工期估算，但需求規格還在另一份文件裡被激烈討論，還沒定案。",
    prompt: "你的回應最接近——",
    options: [
      "給一個寬泛的區間，同時明確列出所有假設。",
      "選最可能的解讀，給出有信心的單一估算。",
      "拒絕估算，說明需求確定後才能給數字。",
      "估算已知的部分，剩餘標記為待確認的阻塞項。"
    ]
  },
  {
    id: "s03",
    tag: "職場 · 同儕意見衝突",
    scene: "RFC 評審中，一位資深同事強力反對你的架構設計。他的論點說得通，但你認為並不正確。討論串是公開的，團隊都看得到。",
    prompt: "你會——",
    options: [
      "直接在討論串上提出反論，附上一張小圖說明。",
      "先私訊他討論，達成共識後再公開摘要結論。",
      "接受他的觀點，因為論點說得通，不值得繼續爭。",
      "邀請第三位評審者介入打平。"
    ]
  }
];

function SJTHeader({ idx, total, role, company, onExit }) {
  const pct = Math.round(((idx + 1) / total) * 100);
  return (
    <header className="sjt-top">
      <div className="sjt-top__brand">
        <img src={window.__resources?.logoMark || "../../assets/logo-mark.svg"} width="22" height="22" alt="" />
        <span>HireCook</span>
      </div>
      <div className="sjt-top__ctx">
        <span className="hc-mono">{role}</span>
        <span className="sjt-top__dot">·</span>
        <span>{company}</span>
      </div>
      <div className="sjt-top__right">
        <div className="sjt-progress">
          <span className="sjt-progress__count hc-mono">{String(idx + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}</span>
          <div className="sjt-progress__track">
            <div className="sjt-progress__fill" style={{ width: `${pct}%` }}></div>
          </div>
        </div>
        <button className="sjt-exit" onClick={onExit}>儲存並離開</button>
      </div>
    </header>
  );
}

function SJTOption({ label, letter, selected, onSelect }) {
  return (
    <button className={`sjt-opt ${selected ? "is-selected" : ""}`} onClick={onSelect}>
      <span className="sjt-opt__letter hc-mono">{letter}</span>
      <span className="sjt-opt__label">{label}</span>
      <span className="sjt-opt__check">
        {selected
          ? <i data-lucide="check-circle-2"></i>
          : <i data-lucide="circle"></i>}
      </span>
    </button>
  );
}

function SJTAssessment({ onExit, onComplete }) {
  const TOTAL_QUESTIONS = 15;
  const [idx, setIdx] = _sjtState(0);
  const [picks, setPicks] = _sjtState({});

  _sjtEff(() => { if (window.lucide) lucide.createIcons(); }, [idx, picks]);

  const item = SJT_ITEMS[idx % SJT_ITEMS.length];
  const selectedIdx = picks[item.id];
  const canNext = selectedIdx != null;
  const isLast = idx === TOTAL_QUESTIONS - 1;

  function pick(i) { setPicks({ ...picks, [item.id]: i }); }

  function next() {
    if (isLast) { onComplete && onComplete(); return; }
    setIdx(idx + 1);
  }
  function prev() { setIdx(Math.max(0, idx - 1)); }

  return (
    <div className="sjt-app">
      <SJTHeader idx={idx} total={TOTAL_QUESTIONS}
        role="後端工程師 L3" company="Aurora Robotics" onExit={onExit} />

      <main className="sjt-main">
        <div className="sjt-scene">
          <div className="sjt-scene__head">
            <span className="hc-eyebrow">情境 {String(idx + 1).padStart(2, "0")} · {item.tag}</span>
            <div className="sjt-scene__badges">
              {item.id.startsWith("k") && <span className="sjt-badge sjt-badge--kitchen"><i data-lucide="utensils"></i>廚房同構情境</span>}
              {item.id.startsWith("s") && <span className="sjt-badge sjt-badge--work"><i data-lucide="monitor"></i>職場情境</span>}
              <span className="sjt-scene__hint"><span className="hc-signal-dot"></span>沒有明顯正確答案 · 選你真實會做的</span>
            </div>
          </div>
          <h1 className="sjt-scene__text">{item.scene}</h1>
          <p className="sjt-scene__prompt">{item.prompt}</p>
        </div>

        <div className="sjt-options">
          {item.options.map((label, i) => (
            <SJTOption key={i}
              label={label}
              letter={String.fromCharCode(65 + i)}
              selected={selectedIdx === i}
              onSelect={() => pick(i)} />
          ))}
        </div>

        <footer className="sjt-foot">
          <button className="sjt-prev" onClick={prev} disabled={idx === 0}>
            <i data-lucide="arrow-left"></i>
            <span>上一題</span>
          </button>
          <div className="sjt-foot__meta">
            <span className="hc-mono hc-muted">約剩 14 分鐘 · 已自動儲存</span>
          </div>
          <button className={`sjt-next ${canNext ? "is-ready" : ""}`} onClick={next} disabled={!canNext}>
            <span>{isLast ? "提交測驗" : "繼續"}</span>
            <i data-lucide={isLast ? "check" : "arrow-right"}></i>
          </button>
        </footer>
      </main>

      <aside className="sjt-aside">
        <div className="sjt-aside__row">
          <i data-lucide="shield-check"></i>
          <span>作答用於行為模型建立，沒有明顯的正確或錯誤答案。</span>
        </div>
        <div className="sjt-aside__row">
          <i data-lucide="timer"></i>
          <span>不限時，每次作答自動儲存。</span>
        </div>
      </aside>
    </div>
  );
}

window.SJTAssessment = SJTAssessment;
