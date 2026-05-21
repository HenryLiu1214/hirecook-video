// TATPlaybook.jsx — candidate detail. Globals: TATPlaybook, PEMap.
function PEMap({ pe, size = 240 }) {
  // 6-axis hexagonal radar: Collaboration, Stress, Autonomy, Decision velocity, Conflict, Empathy
  const axes = ["Collab.", "Stress reg.", "Autonomy", "Decision v.", "Conflict", "Empathy"];
  const cx = size / 2, cy = size / 2, r = size / 2 - 26;
  const points = (vals) => vals.map((v, i) => {
    const a = -Math.PI / 2 + (i * Math.PI * 2) / vals.length;
    const rr = (v / 100) * r;
    return [cx + Math.cos(a) * rr, cy + Math.sin(a) * rr];
  });
  const path = (vals) => points(vals).map((p, i) => `${i ? "L" : "M"}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(" ") + " Z";

  const rings = [0.25, 0.5, 0.75, 1];

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {/* Concentric rings (hex) */}
      {rings.map((k, idx) => {
        const pts = Array.from({ length: 6 }, (_, i) => {
          const a = -Math.PI / 2 + (i * Math.PI * 2) / 6;
          return `${cx + Math.cos(a) * r * k},${cy + Math.sin(a) * r * k}`;
        }).join(" ");
        return <polygon key={idx} points={pts} fill="none" stroke="rgba(8,16,40,0.08)" />;
      })}
      {/* Spokes */}
      {axes.map((_, i) => {
        const a = -Math.PI / 2 + (i * Math.PI * 2) / 6;
        return <line key={i} x1={cx} y1={cy} x2={cx + Math.cos(a) * r} y2={cy + Math.sin(a) * r} stroke="rgba(8,16,40,0.08)" />;
      })}
      {/* E shape — environment */}
      <path d={path(pe.E)} fill="rgba(33,81,245,0.10)" stroke="#2151F5" strokeWidth="1.5" />
      {/* P shape — personality */}
      <path d={path(pe.P)} fill="rgba(0,180,216,0.10)" stroke="#00B4D8" strokeWidth="1.5" />
      {/* Axis labels */}
      {axes.map((label, i) => {
        const a = -Math.PI / 2 + (i * Math.PI * 2) / 6;
        const lx = cx + Math.cos(a) * (r + 16);
        const ly = cy + Math.sin(a) * (r + 16);
        return <text key={i} x={lx} y={ly} fontSize="9.5" fontFamily="JetBrains Mono, monospace"
          fill="rgba(54,65,89,0.7)" textAnchor="middle" dominantBaseline="middle" letterSpacing="0.06em">{label.toUpperCase()}</text>;
      })}
    </svg>
  );
}

function DriversList({ drivers }) {
  const max = Math.max(...drivers.map(d => Math.abs(d.v)));
  return (
    <div className="hc-drivers">
      {drivers.map(d => {
        const pos = d.v >= 0;
        const w = (Math.abs(d.v) / max) * 100;
        return (
          <div key={d.name} className="hc-driver">
            <div className="hc-driver__head">
              <span className="hc-driver__name">{d.name}</span>
              <span className={`hc-driver__val ${pos ? "is-pos" : "is-neg"}`}>{pos ? "+" : ""}{d.v.toFixed(1)}</span>
            </div>
            <div className="hc-driver__track">
              <div className={`hc-driver__bar ${pos ? "is-pos" : "is-neg"}`} style={{ width: `${w}%` }}></div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function TATPlaybook({ candidateId, onBack }) {
  const c = window.HC_DATA.candidates.find(x => x.id === candidateId);
  if (!c) return null;
  const r = window.HC_DATA.roles.find(rr => rr.id === c.roleId);

  return (
    <div className="hc-view">
      <div className="hc-crumb">
        <button className="hc-crumb__back" onClick={onBack}><i data-lucide="arrow-left"></i></button>
        <span className="hc-crumb__seg">候選人</span>
        <i data-lucide="chevron-right" className="hc-crumb__sep"></i>
        <span className="hc-crumb__seg hc-crumb__seg--current">{c.name}</span>
      </div>

      <div className="hc-page-head">
        <div>
          <Eyebrow>TAT PLAYBOOK · {c.id}</Eyebrow>
          <div className="hc-detail-head">
            <div className="hc-avatar hc-avatar--lg">{c.initials}</div>
            <div>
              <h1 className="hc-h1">{c.name}</h1>
              <div className="hc-detail-head__sub">{c.role} · {c.days} 天前測驗 via {c.sjt}</div>
            </div>
            <Chip status={c.status} dot>{c.status}</Chip>
          </div>
        </div>
        <div className="hc-page-head__cta">
          <Button variant="ghost" icon="share-2">分享</Button>
          <Button variant="secondary" icon="download">下載 PDF</Button>
          <Button variant="primary" icon="check">推進候選人</Button>
        </div>
      </div>

      <div className="hc-kpi-row">
        <KPI eyebrow="P × E 適配" value={c.score.toFixed(1)} unit="/100" sub={`± ${c.ci.toFixed(1)} 信賴區間`} delta="+4.2" signal />
        <KPI eyebrow="6 個月留任率" value={c.retention6mo} unit="%" sub="對照企業基準 65.4%" />
        <KPI eyebrow="錯配成本節省" value="22" unit="萬" sub="NT$ · 預期效益" />
        <KPI eyebrow="預測信心度" value={(100 - c.ci * 10).toFixed(0)} unit="%" sub="model.v4.3 · 穩定" />
      </div>

      <div className="hc-detail-grid">
        <Card>
          <Eyebrow>P × E MAP</Eyebrow>
          <div className="hc-pemap">
            <PEMap pe={c.pe} />
            <div className="hc-pemap__legend">
              <div className="hc-pemap__leg"><span className="hc-pemap__swatch" style={{ background: "#00B4D8" }}></span>P · 人格</div>
              <div className="hc-pemap__leg"><span className="hc-pemap__swatch" style={{ background: "#2151F5" }}></span>E · 環境</div>
              <p className="hc-pemap__note">重疊越多代表適配度越高；落差越大代表有可介入的潛在衝突點。</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="hc-card__head">
            <Eyebrow>XAI · 驅動因子</Eyebrow>
            <span className="hc-card__hint hc-mono">Δ 對照團隊基準</span>
          </div>
          <DriversList drivers={c.drivers} />
        </Card>

        <Card>
          <Eyebrow>職位環境</Eyebrow>
          <div className="hc-h3">{r.title}</div>
          <div className="hc-detail-meta">
            <div><span className="hc-detail-meta__k">團隊</span><span>{r.team}</span></div>
            <div><span className="hc-detail-meta__k">壓力</span><span>{r.stress}</span></div>
            <div><span className="hc-detail-meta__k">協作</span><span>{r.collab}</span></div>
            <div><span className="hc-detail-meta__k">自主性</span><span>{r.autonomy}</span></div>
            <div><span className="hc-detail-meta__k">決策</span><span>{r.decisions}</span></div>
          </div>
        </Card>

        <Card className="hc-card--span2">
          <Eyebrow>管理建議</Eyebrow>
          <ol className="hc-recs">
            {c.management.map((m, i) => (
              <li key={i} className="hc-recs__item">
                <span className="hc-recs__num">{String(i + 1).padStart(2, "0")}</span>
                <span>{m}</span>
              </li>
            ))}
          </ol>
        </Card>

        {c.onboarding && (
          <Card className="hc-card--span2">
            <div className="hc-card__head">
              <Eyebrow>前 90 天 · 入職計畫</Eyebrow>
              <span className="hc-card__hint hc-mono">三階段 · 依本輪廓客製</span>
            </div>
            <div className="hc-onboard">
              {c.onboarding.map((p, i) => (
                <div key={p.phase} className="hc-onboard__phase">
                  <div className="hc-onboard__head">
                    <span className="hc-onboard__num hc-mono">{String(i + 1).padStart(2, "0")}</span>
                    <div>
                      <div className="hc-onboard__phaselbl">{p.phase}</div>
                      <div className="hc-onboard__title">{p.title}</div>
                    </div>
                  </div>
                  <ul className="hc-onboard__list">
                    {p.items.map((item, j) => (
                      <li key={j}>
                        <i data-lucide="check" className="hc-onboard__check"></i>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </Card>
        )}

        {c.comms && (
          <Card>
            <Eyebrow>溝通偏好</Eyebrow>
            <div className="hc-comms">
              <div className="hc-comms__row">
                <span className="hc-comms__k">PRIMARY CHANNEL</span>
                <span className="hc-comms__v">{c.comms.primary}</span>
              </div>
              <div className="hc-comms__row">
                <span className="hc-comms__k">1:1 CADENCE</span>
                <span className="hc-comms__v">{c.comms.cadence}</span>
              </div>
              <div className="hc-comms__row">
                <span className="hc-comms__k">MEETING LOAD</span>
                <span className="hc-comms__v">{c.comms.meetingLoad}</span>
              </div>
              <div className="hc-comms__row">
                <span className="hc-comms__k">FEEDBACK STYLE</span>
                <span className="hc-comms__v">{c.comms.feedback}</span>
              </div>
              <p className="hc-comms__note">{c.comms.notes}</p>
            </div>
          </Card>
        )}

        {c.warnings && (
          <Card>
            <div className="hc-card__head">
              <Eyebrow>壓力預警指標</Eyebrow>
              <span className="hc-card__hint hc-mono">先行指標</span>
            </div>
            <div className="hc-warnings">
              {c.warnings.map((w, i) => (
                <div key={i} className={`hc-warning hc-warning--${w.severity}`}>
                  <div className="hc-warning__head">
                    <span className="hc-warning__signal">{w.signal}</span>
                    <Chip status={w.severity} dot>{w.severity}</Chip>
                  </div>
                  <div className="hc-warning__meta">
                    <span className="hc-mono hc-muted">threshold · {w.threshold}</span>
                  </div>
                  <p className="hc-warning__why">{w.why}</p>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}

window.TATPlaybook = TATPlaybook;
window.PEMap = PEMap;
