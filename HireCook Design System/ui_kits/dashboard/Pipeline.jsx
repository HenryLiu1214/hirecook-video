// Pipeline.jsx — 流程總覽（繁中版）
function StageCard({ num, eyebrow, audience, title, body, status, statusLabel, cta, ctaIcon, illustration, onClick }) {
  return (
    <div className={`pipe-stage pipe-stage--${status}`} onClick={onClick}>
      <div className="pipe-stage__num hc-mono">{String(num).padStart(2, "0")}</div>
      <div className="pipe-stage__body">
        <div className="pipe-stage__eyebrow">
          <Eyebrow>{eyebrow}</Eyebrow>
          <Chip status={status === "active" ? "signal" : status === "ready" ? "fit" : "neutral"} dot>{statusLabel}</Chip>
        </div>
        <h2 className="hc-h2 pipe-stage__title">{title}</h2>
        <div className="pipe-stage__audience">
          <i data-lucide={audience.icon}></i>
          <span>{audience.label}</span>
        </div>
        <p className="pipe-stage__copy">{body}</p>
        <div className="pipe-stage__cta">
          <span className="hc-link"><span>{cta}</span><i data-lucide={ctaIcon || "arrow-right"}></i></span>
        </div>
      </div>
      <div className="pipe-stage__viz">{illustration}</div>
    </div>
  );
}

function StageVizEnv() {
  return (
    <svg viewBox="0 0 200 200" width="100%" height="100%">
      <rect x="14" y="14" width="172" height="172" rx="14" fill="none" stroke="#2151F5" strokeWidth="1" opacity="0.4" />
      {[40, 100, 160].map(y => [40, 100, 160].map(x => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r="3" fill="#2151F5" opacity="0.25" />
      )))}
      <rect x="140" y="140" width="22" height="22" rx="3" fill="#2151F5" />
      <rect x="140" y="80"  width="22" height="22" rx="3" fill="#2151F5" opacity="0.7" />
      <rect x="80"  y="140" width="22" height="22" rx="3" fill="#2151F5" opacity="0.7" />
      <text x="100" y="48" fontSize="9" fontFamily="JetBrains Mono, monospace" fill="#5C677F" textAnchor="middle" letterSpacing="0.12em">環境模型</text>
    </svg>
  );
}

function StageVizSJT() {
  return (
    <svg viewBox="0 0 200 200" width="100%" height="100%">
      <rect x="20" y="30" width="160" height="36" rx="6" fill="#F2F4F9" stroke="rgba(8,16,40,0.06)" />
      <line x1="32" y1="44" x2="120" y2="44" stroke="#0B1020" strokeWidth="3" strokeLinecap="round" opacity="0.8" />
      <line x1="32" y1="56" x2="100" y2="56" stroke="#0B1020" strokeWidth="2" strokeLinecap="round" opacity="0.4" />
      {[80, 110, 140, 170].map((y, i) => (
        <g key={i}>
          <rect x="20" y={y} width="160" height="22" rx="6" fill={i === 1 ? "#EAF0FF" : "#FFFFFF"} stroke={i === 1 ? "#2151F5" : "rgba(8,16,40,0.08)"} strokeWidth={i === 1 ? "1.5" : "1"} />
          <circle cx="32" cy={y + 11} r="4" fill="none" stroke={i === 1 ? "#2151F5" : "#8C95AE"} strokeWidth="1.5" />
          {i === 1 && <circle cx="32" cy={y + 11} r="2" fill="#2151F5" />}
        </g>
      ))}
    </svg>
  );
}

function StageVizPlaybook() {
  return (
    <svg viewBox="0 0 200 200" width="100%" height="100%">
      <rect x="20" y="20" width="160" height="160" rx="10" fill="#FFFFFF" stroke="rgba(8,16,40,0.10)" />
      <rect x="36" y="40" width="60" height="8" rx="2" fill="#2151F5" />
      <rect x="36" y="56" width="100" height="6" rx="2" fill="#0B1020" opacity="0.7" />
      <rect x="36" y="68" width="80" height="6" rx="2" fill="#0B1020" opacity="0.3" />
      <text x="36" y="106" fontSize="36" fontWeight="600" fontFamily="Inter, sans-serif" fill="#0B1020">82</text>
      <text x="100" y="106" fontSize="12" fontFamily="JetBrains Mono, monospace" fill="#8C95AE">/100</text>
      <rect x="116" y="84" width="46" height="22" rx="11" fill="#E6F5EC" stroke="rgba(27,122,77,0.22)" />
      <circle cx="125" cy="95" r="3" fill="#1B7A4D" />
      <text x="134" y="100" fontSize="10" fontFamily="Inter, sans-serif" fill="#146F3E" fontWeight="500">適配</text>
      <rect x="36" y="130" width="128" height="6" rx="3" fill="#F2F4F9" />
      <rect x="36" y="130" width="100" height="6" rx="3" fill="#2151F5" />
      <rect x="36" y="146" width="128" height="6" rx="3" fill="#F2F4F9" />
      <rect x="36" y="146" width="76" height="6" rx="3" fill="#00B4D8" />
      <rect x="36" y="162" width="128" height="6" rx="3" fill="#F2F4F9" />
      <rect x="36" y="162" width="40" height="6" rx="3" fill="#E55A4D" />
    </svg>
  );
}

function Pipeline({ setRoute }) {
  const candidates = window.HC_DATA.candidates;
  const roles = window.HC_DATA.roles;
  const fit = candidates.filter(c => c.status === "fit").length;
  const watch = candidates.filter(c => c.status === "watch").length;
  const risk = candidates.filter(c => c.status === "risk").length;

  return (
    <div className="hc-view">
      <div className="hc-page-head">
        <div>
          <Eyebrow signal>D-I-T · 核心流程</Eyebrow>
          <h1 className="hc-h1">三個核心階段，完整流程。</h1>
          <p className="hc-page-head__sub">HireCook 把招募轉化為結構化預測：建模職位環境、在壓力情境中模擬行為、產出主管能實際運用的 Playbook。</p>
        </div>
        <div className="hc-page-head__cta">
          <Button variant="ghost" icon="book-open">閱讀方法論</Button>
          <Button variant="primary" icon="plus" onClick={() => setRoute({ view: "role-builder" })}>新增職位環境</Button>
        </div>
      </div>

      <div className="hc-kpi-row">
        <KPI eyebrow="環境模型 · 進行中" value={roles.length} unit="" sub={`共 ${roles.length} 個職位`} />
        <KPI eyebrow="SJT 進行中" value="7" unit="" sub="24 位受邀，完成 7 位" signal />
        <KPI eyebrow="Playbook · 已就緒" value={fit + watch + risk} unit="" sub={`${fit} 適配 · ${watch} 留意 · ${risk} 高風險`} />
        <KPI eyebrow="留任率提升" value="+11.6" unit="pp" sub="對照企業基準" delta="+1.4" />
      </div>

      <div className="pipe-flow">
        <StageCard
          num={1}
          eyebrow="STEP 1 · 職位環境建模"
          audience={{ icon: "building-2", label: "企業 / HR" }}
          status="ready"
          statusLabel="4 個進行中"
          title="先定義環境，再定義人才。"
          body="結構化問卷蒐集團隊結構、協作密度、決策節奏與壓力輪廓。系統輸出環境指紋，以及最可能適配——或引發摩擦——的人格類型分析。"
          cta="開啟環境建模器"
          ctaIcon="arrow-right"
          illustration={<StageVizEnv />}
          onClick={() => setRoute({ view: "role-builder" })}
        />

        <div className="pipe-arrow"><i data-lucide="arrow-right"></i></div>

        <StageCard
          num={2}
          eyebrow="STEP 2 · 情境判斷測驗（SJT）"
          audience={{ icon: "user", label: "求職者" }}
          status="active"
          statusLabel="推論中"
          title="在壓力情境中模擬行為，不靠自陳。"
          body="候選人回答從行為模擬語料庫中萃取的系列高壓職場情境。沒有明顯正確答案，偽裝效應因此崩潰。系統從作答模式推估人格向量。"
          cta="預覽候選人體驗"
          ctaIcon="play"
          illustration={<StageVizSJT />}
          onClick={() => setRoute({ view: "sjt-take" })}
        />

        <div className="pipe-arrow"><i data-lucide="arrow-right"></i></div>

        <StageCard
          num={3}
          eyebrow="STEP 3 · TAT Playbook"
          audience={{ icon: "user-check", label: "用人主管" }}
          status="ready"
          statusLabel={`${fit + watch + risk} 份已就緒`}
          title="不只是分數，而是管理手冊。"
          body="HireCook 為每位候選人生成 TAT Playbook：P × E 適配分析、驅動因子解釋、依輪廓客製的 90 天入職計畫、溝通偏好，以及需要留意的壓力預警指標。"
          cta="開啟最新 Playbook"
          ctaIcon="arrow-right"
          illustration={<StageVizPlaybook />}
          onClick={() => setRoute({ view: "candidates" })}
        />
      </div>

      <div className="pipe-foot">
        <div className="pipe-foot__formula">
          <Eyebrow>每次預測背後的公式</Eyebrow>
          <div className="pipe-foot__eq">B = f(P × E)</div>
          <div className="pipe-foot__hint">行為是人格與環境交互作用的結果。我們對兩者都建模，再預測輸出。</div>
        </div>
        <div className="pipe-foot__north">
          <div className="pipe-foot__northrow">
            <span className="hc-mono hc-muted">北極星指標 · 6 個月新人留任率</span>
            <span className="hc-mono hc-muted">model.v4.3</span>
          </div>
          <div className="pipe-foot__north-bars">
            <div className="pipe-foot__north-bar">
              <span className="pipe-foot__north-lbl">台灣企業基準</span>
              <div className="pipe-foot__north-track"><div className="pipe-foot__north-fill" style={{ width: "65.4%", background: "rgba(8,16,40,0.18)" }}></div></div>
              <span className="hc-mono">65.4%</span>
            </div>
            <div className="pipe-foot__north-bar">
              <span className="pipe-foot__north-lbl">HireCook 驗證組</span>
              <div className="pipe-foot__north-track"><div className="pipe-foot__north-fill" style={{ width: "77.0%", background: "#2151F5" }}></div></div>
              <span className="hc-mono">77.0%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

window.Pipeline = Pipeline;
