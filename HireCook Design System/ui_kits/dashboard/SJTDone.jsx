// SJTDone.jsx — 感謝提交過渡頁（候選人端，chromeless）
// Globals: SJTDone

function SJTDone({ onReturn }) {
  const { useEffect: _eff } = React;
  _eff(() => { if (window.lucide) lucide.createIcons(); }, []);

  // Animated signal dot pulse timing — purely decorative
  const STEPS = [
    { icon: "check-circle-2", label: "作答已送出", status: "done" },
    { icon: "cpu",            label: "行為向量推估中",  status: "active" },
    { icon: "layers",         label: "P × E 適配分析", status: "pending" },
    { icon: "book-open",      label: "TAT Playbook 生成", status: "pending" }
  ];

  return (
    <div className="sjt-app sjt-done-app">
      <header className="sjt-top">
        <div className="sjt-top__brand">
          <img src={window.__resources?.logoMark || "../../assets/logo-mark.svg"} width="22" height="22" alt="" />
          <span>HireCook</span>
        </div>
        <div className="sjt-top__ctx" style={{ opacity: 0 }}>—</div>
        <div className="sjt-top__right" style={{ justifySelf: "end" }}>
          <span className="hc-mono hc-muted" style={{ fontSize: 12 }}>已完成 · 可以關閉此頁面</span>
        </div>
      </header>

      <main className="sjt-done-main">
        <div className="sjt-done-icon">
          <i data-lucide="check-circle-2"></i>
        </div>
        <h1 className="sjt-done-title">感謝你完成測驗。</h1>
        <p className="sjt-done-sub">你的作答已安全傳送。HireCook 將從你的作答模式推估行為特徵，並與職位環境模型比對，產出適配分析報告供用人主管參考。</p>
        <p className="sjt-done-note">這份測驗沒有標準答案，分析基於行為模式，而非單一選項的對錯。</p>

        <div className="sjt-done-pipeline">
          <div className="sjt-done-pipeline__head hc-eyebrow">接下來的流程</div>
          <div className="sjt-done-pipeline__steps">
            {STEPS.map((s, i) => (
              <div key={i} className={`sjt-done-step sjt-done-step--${s.status}`}>
                <div className="sjt-done-step__icon">
                  {s.status === "done"   && <i data-lucide="check"></i>}
                  {s.status === "active" && <span className="sjt-done-pulse"></span>}
                  {s.status === "pending" && <span className="sjt-done-step__dot"></span>}
                </div>
                <span className="sjt-done-step__label">{s.label}</span>
                {i < STEPS.length - 1 && <span className="sjt-done-step__line"></span>}
              </div>
            ))}
          </div>
        </div>

        <div className="sjt-done-footer">
          <p className="sjt-done-footer__text">如有任何問題，請聯繫邀請你參加測驗的企業。</p>
          <button className="sjt-done-close" onClick={onReturn}>關閉</button>
        </div>
      </main>
    </div>
  );
}

window.SJTDone = SJTDone;
