// RoleResult.jsx — 建模完成結果頁，顯示在 Step 1 "建立環境模型" 之後
// Globals: RoleResult
// route: { view: "role-result", title, env }

function RoleResult({ title, env, setRoute }) {
  const { useEffect: _eff } = React;
  _eff(() => { if (window.lucide) lucide.createIcons(); }, []);

  // Re-use the same scoring from RoleBuilder (need to have access to same weights)
  // We pass env in through route, score inline here
  const MBTI = ["INTJ","INTP","ENTJ","ENTP","INFJ","INFP","ENFJ","ENFP",
                 "ISTJ","ISFJ","ESTJ","ESFJ","ISTP","ISFP","ESTP","ESFP"];
  const DIMS = ["collab","stress","autonomy","velocity","scope","ambig"];
  const W = {
    INTJ:{collab:-1.0,stress:0.3,autonomy:1.5,velocity:0.6,scope:1.5,ambig:1.4},
    INTP:{collab:-1.0,stress:-0.6,autonomy:1.4,velocity:-0.3,scope:1.1,ambig:1.6},
    ENTJ:{collab:0.8,stress:1.1,autonomy:1.2,velocity:1.5,scope:1.6,ambig:0.8},
    ENTP:{collab:1.0,stress:0.6,autonomy:1.3,velocity:1.3,scope:1.0,ambig:1.5},
    INFJ:{collab:0.2,stress:-0.4,autonomy:0.8,velocity:-0.2,scope:1.0,ambig:0.4},
    INFP:{collab:-0.4,stress:-0.8,autonomy:1.2,velocity:-0.5,scope:0.4,ambig:0.5},
    ENFJ:{collab:1.4,stress:0.4,autonomy:0.6,velocity:0.5,scope:0.6,ambig:0.2},
    ENFP:{collab:1.2,stress:-0.2,autonomy:1.0,velocity:0.5,scope:0.5,ambig:1.0},
    ISTJ:{collab:-0.4,stress:0.3,autonomy:-0.6,velocity:-0.6,scope:-0.8,ambig:-1.4},
    ISFJ:{collab:0.4,stress:-0.6,autonomy:-0.8,velocity:-0.6,scope:-0.8,ambig:-1.2},
    ESTJ:{collab:1.0,stress:0.8,autonomy:0.2,velocity:0.8,scope:0.4,ambig:-0.8},
    ESFJ:{collab:1.4,stress:0.0,autonomy:-0.4,velocity:0.2,scope:-0.4,ambig:-0.8},
    ISTP:{collab:-0.6,stress:0.4,autonomy:1.0,velocity:0.6,scope:-0.2,ambig:0.4},
    ISFP:{collab:0.2,stress:-0.6,autonomy:0.6,velocity:-0.2,scope:-0.6,ambig:0.2},
    ESTP:{collab:1.0,stress:1.2,autonomy:0.6,velocity:1.4,scope:0.0,ambig:0.8},
    ESFP:{collab:1.4,stress:0.2,autonomy:0.2,velocity:0.8,scope:-0.4,ambig:0.4}
  };

  function score(t) {
    const w = W[t]; let s = 0, d = 0;
    for (const k of DIMS) { const n = (env[k] - 50) / 50; s += n * w[k]; d += Math.abs(w[k]); }
    return Math.max(0, Math.min(100, Math.round(60 + (d > 0 ? s / d : 0) * 35)));
  }

  const scored = MBTI.map(t => ({ t, s: score(t) })).sort((a, b) => b.s - a.s);
  const fits = scored.filter(x => x.s >= 75).slice(0, 5);
  const risks = scored.filter(x => x.s < 55).slice(0, 4);
  const pressureIdx = Math.round((env.collab + env.stress + env.velocity) / 3);

  // Hexagonal radar – compact version
  function MiniRadar({ size = 200 }) {
    const cx = size / 2, cy = size / 2, r = size / 2 - 28;
    const labels = ["協作","壓力","自主","決速","範疇","模糊"];
    const vals = ["collab","stress","autonomy","velocity","scope","ambig"].map(k => env[k]);
    const pts = vals.map((v, i) => {
      const a = -Math.PI / 2 + (i * Math.PI * 2) / 6;
      return [cx + Math.cos(a) * (v / 100) * r, cy + Math.sin(a) * (v / 100) * r];
    });
    const path = pts.map((p, i) => `${i ? "L" : "M"}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(" ") + " Z";
    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {[0.33,0.66,1].map((k, i) => {
          const p = Array.from({length:6},(_,j)=>{
            const a=-Math.PI/2+(j*Math.PI*2)/6;
            return `${cx+Math.cos(a)*r*k},${cy+Math.sin(a)*r*k}`;
          }).join(" ");
          return <polygon key={i} points={p} fill="none" stroke="rgba(8,16,40,0.08)" />;
        })}
        {vals.map((_,i)=>{const a=-Math.PI/2+(i*Math.PI*2)/6; return <line key={i} x1={cx} y1={cy} x2={cx+Math.cos(a)*r} y2={cy+Math.sin(a)*r} stroke="rgba(8,16,40,0.06)"/>;})}
        <path d={path} fill="rgba(33,81,245,0.14)" stroke="#2151F5" strokeWidth="1.5" />
        {labels.map((lb, i) => {
          const a = -Math.PI / 2 + (i * Math.PI * 2) / 6;
          const lx = cx + Math.cos(a) * (r + 16), ly = cy + Math.sin(a) * (r + 16);
          return <text key={i} x={lx} y={ly} fontSize="9.5" fontFamily="'Noto Sans TC','Inter',sans-serif" fill="rgba(54,65,89,0.7)" textAnchor="middle" dominantBaseline="middle">{lb}</text>;
        })}
      </svg>
    );
  }

  return (
    <div className="hc-view">
      <div className="hc-crumb">
        <button className="hc-crumb__back" onClick={() => setRoute({ view: "roles" })}>
          <i data-lucide="arrow-left"></i>
        </button>
        <span className="hc-crumb__seg">職位環境</span>
        <i data-lucide="chevron-right" className="hc-crumb__sep"></i>
        <span className="hc-crumb__seg hc-crumb__seg--current">建模完成</span>
      </div>

      <div className="rr-hero">
        <div className="rr-hero__icon"><i data-lucide="check-circle-2"></i></div>
        <div>
          <Eyebrow signal>建模完成 · STEP 1 · 職位環境建模</Eyebrow>
          <h1 className="hc-h1" style={{ marginTop: 8 }}>「{title}」的環境模型已就緒。</h1>
          <p className="hc-page-head__sub">系統已建立該職位的行為壓力輪廓，計算出 16 種人格類型的適配分布，並標記潛在摩擦風險。接下來可以邀請候選人參加 SJT。</p>
        </div>
      </div>

      <div className="rr-grid">
        <Card>
          <Eyebrow>環境指紋</Eyebrow>
          <div className="rr-radar">
            <MiniRadar />
            <div className="rr-radar__stats">
              <div>
                <div className="rr-stat"><span className="rr-stat__num">{pressureIdx}</span><span className="rr-stat__unit">/100</span></div>
                <div className="rr-stat__lbl">綜合壓力指數</div>
              </div>
              <div className="rr-checklist">
                {[
                  { k: "協作密度",  v: env.collab },
                  { k: "壓力基準",  v: env.stress },
                  { k: "自主性",    v: env.autonomy },
                  { k: "決策速度",  v: env.velocity },
                ].map(item => (
                  <div key={item.k} className="rr-check">
                    <span className="rr-check__k">{item.k}</span>
                    <div className="rr-check__bar-wrap">
                      <div className="rr-check__bar" style={{ width: `${item.v}%` }}></div>
                    </div>
                    <span className="rr-check__v hc-mono">{item.v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="hc-card__head">
            <Eyebrow>最佳適配型</Eyebrow>
            <Chip status="fit" dot>{fits.length} 種人格</Chip>
          </div>
          <div className="rr-type-list">
            {fits.map(x => (
              <div key={x.t} className="rr-type-row">
                <span className="rr-type-badge">{x.t}</span>
                <div className="rr-type-bar-wrap"><div className="rr-type-bar" style={{ width: `${x.s}%`, background: "#2151F5" }}></div></div>
                <span className="hc-mono" style={{ color: "#146F3E", fontSize: 12 }}>{x.s}</span>
              </div>
            ))}
          </div>
          {risks.length > 0 && (
            <>
              <div className="hc-card__head" style={{ marginTop: 16 }}>
                <Eyebrow>摩擦風險型</Eyebrow>
                <Chip status="risk" dot>{risks.length} 種</Chip>
              </div>
              <div className="rr-type-list">
                {risks.map(x => (
                  <div key={x.t} className="rr-type-row">
                    <span className="rr-type-badge rr-type-badge--risk">{x.t}</span>
                    <div className="rr-type-bar-wrap"><div className="rr-type-bar" style={{ width: `${x.s}%`, background: "#B83A2E" }}></div></div>
                    <span className="hc-mono" style={{ color: "#A02A1F", fontSize: 12 }}>{x.s}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </Card>

        <Card className="hc-card--span2">
          <Eyebrow>接下來的步驟</Eyebrow>
          <div className="rr-steps">
            <div className="rr-nextstep rr-nextstep--active">
              <div className="rr-nextstep__icon"><i data-lucide="user-plus"></i></div>
              <div>
                <div className="rr-nextstep__title">邀請候選人完成 SJT</div>
                <div className="rr-nextstep__copy">將測驗連結傳送給候選人，系統將從其作答模式推估人格向量，並與此環境模型比對。</div>
              </div>
              <Button variant="primary" icon="arrow-right" onClick={() => setRoute({ view: "pipeline" })}>邀請候選人</Button>
            </div>
            <div className="rr-nextstep">
              <div className="rr-nextstep__icon"><i data-lucide="layers"></i></div>
              <div>
                <div className="rr-nextstep__title">調整環境模型</div>
                <div className="rr-nextstep__copy">如果職位描述改變，可以修改六個軸向維度，系統將即時重新計算適配分布。</div>
              </div>
              <Button variant="secondary" icon="pencil" onClick={() => setRoute({ view: "role-builder" })}>重新建模</Button>
            </div>
            <div className="rr-nextstep">
              <div className="rr-nextstep__icon"><i data-lucide="bar-chart-3"></i></div>
              <div>
                <div className="rr-nextstep__title">查看所有職位環境</div>
                <div className="rr-nextstep__copy">此環境模型已儲存至職位環境列表，可與其他職位的適配分布進行比較。</div>
              </div>
              <Button variant="ghost" icon="arrow-right" onClick={() => setRoute({ view: "roles" })}>前往職位環境</Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

window.RoleResult = RoleResult;
