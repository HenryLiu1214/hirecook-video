// RoleBuilder.jsx — Step 1 of the D-I-T flow（繁中版）
const { useState: _rbState, useEffect: _rbEff } = React;

const RB_DIMS = [
  { key: "collab",   label: "協作密度",        left: "單兵作戰", right: "持續配對",    iconL: "user",           iconR: "users-round" },
  { key: "stress",   label: "壓力基準",        left: "穩定節奏", right: "高壓循環",    iconL: "minus",          iconR: "activity" },
  { key: "autonomy", label: "自主性",          left: "高度指導", right: "自主驅動",    iconL: "compass",        iconR: "wand-sparkles" },
  { key: "velocity", label: "決策速度",        left: "深思熟慮", right: "快速推進",    iconL: "clock",          iconR: "zap" },
  { key: "scope",    label: "決策範疇",        left: "戰術執行", right: "策略規劃",    iconL: "list",           iconR: "telescope" },
  { key: "ambig",    label: "模糊度容忍需求",  left: "規格明確", right: "高度模糊",    iconL: "ruler",          iconR: "scan-line" }
];

const MBTI = [
  "INTJ","INTP","ENTJ","ENTP",
  "INFJ","INFP","ENFJ","ENFP",
  "ISTJ","ISFJ","ESTJ","ESFJ",
  "ISTP","ISFP","ESTP","ESFP"
];

const RB_WEIGHTS = {
  INTJ: { collab: -1.0, stress:  0.3, autonomy:  1.5, velocity:  0.6, scope:  1.5, ambig:  1.4 },
  INTP: { collab: -1.0, stress: -0.6, autonomy:  1.4, velocity: -0.3, scope:  1.1, ambig:  1.6 },
  ENTJ: { collab:  0.8, stress:  1.1, autonomy:  1.2, velocity:  1.5, scope:  1.6, ambig:  0.8 },
  ENTP: { collab:  1.0, stress:  0.6, autonomy:  1.3, velocity:  1.3, scope:  1.0, ambig:  1.5 },
  INFJ: { collab:  0.2, stress: -0.4, autonomy:  0.8, velocity: -0.2, scope:  1.0, ambig:  0.4 },
  INFP: { collab: -0.4, stress: -0.8, autonomy:  1.2, velocity: -0.5, scope:  0.4, ambig:  0.5 },
  ENFJ: { collab:  1.4, stress:  0.4, autonomy:  0.6, velocity:  0.5, scope:  0.6, ambig:  0.2 },
  ENFP: { collab:  1.2, stress: -0.2, autonomy:  1.0, velocity:  0.5, scope:  0.5, ambig:  1.0 },
  ISTJ: { collab: -0.4, stress:  0.3, autonomy: -0.6, velocity: -0.6, scope: -0.8, ambig: -1.4 },
  ISFJ: { collab:  0.4, stress: -0.6, autonomy: -0.8, velocity: -0.6, scope: -0.8, ambig: -1.2 },
  ESTJ: { collab:  1.0, stress:  0.8, autonomy:  0.2, velocity:  0.8, scope:  0.4, ambig: -0.8 },
  ESFJ: { collab:  1.4, stress:  0.0, autonomy: -0.4, velocity:  0.2, scope: -0.4, ambig: -0.8 },
  ISTP: { collab: -0.6, stress:  0.4, autonomy:  1.0, velocity:  0.6, scope: -0.2, ambig:  0.4 },
  ISFP: { collab:  0.2, stress: -0.6, autonomy:  0.6, velocity: -0.2, scope: -0.6, ambig:  0.2 },
  ESTP: { collab:  1.0, stress:  1.2, autonomy:  0.6, velocity:  1.4, scope:  0.0, ambig:  0.8 },
  ESFP: { collab:  1.4, stress:  0.2, autonomy:  0.2, velocity:  0.8, scope: -0.4, ambig:  0.4 }
};

function rbScoreType(type, env) {
  const w = RB_WEIGHTS[type];
  let s = 0, denom = 0;
  for (const d of RB_DIMS) {
    const n = (env[d.key] - 50) / 50;
    s += n * w[d.key];
    denom += Math.abs(w[d.key]);
  }
  const norm = denom > 0 ? s / denom : 0;
  return Math.max(0, Math.min(100, Math.round(60 + norm * 35)));
}

function rbBand(s) {
  if (s >= 75) return "fit";
  if (s >= 55) return "neutral";
  return "risk";
}

function Slider({ label, left, right, iconL, iconR, value, onChange }) {
  return (
    <div className="rb-slider">
      <div className="rb-slider__head">
        <span className="rb-slider__label">{label}</span>
        <span className="rb-slider__value hc-mono">{value}</span>
      </div>
      <div className="rb-slider__row">
        <i data-lucide={iconL} className="rb-slider__icon"></i>
        <input type="range" min="0" max="100" step="5" value={value} onChange={e => onChange(Number(e.target.value))} className="rb-slider__input" />
        <i data-lucide={iconR} className="rb-slider__icon"></i>
      </div>
      <div className="rb-slider__ends">
        <span>{left}</span>
        <span>{right}</span>
      </div>
    </div>
  );
}

function MBTIFitGrid({ env }) {
  const scored = MBTI.map(t => ({ t, s: rbScoreType(t, env) }));
  return (
    <div className="rb-mbti-grid">
      {scored.map(({ t, s }) => (
        <div key={t} className={`rb-mbti rb-mbti--${rbBand(s)}`}>
          <span className="rb-mbti__type">{t}</span>
          <span className="rb-mbti__score hc-mono">{s}</span>
        </div>
      ))}
    </div>
  );
}

function EnvFingerprint({ env, size = 220 }) {
  const cx = size / 2, cy = size / 2, r = size / 2 - 32;
  const axes = ["協作", "壓力", "自主", "決速", "範疇", "模糊"];
  const vals = RB_DIMS.map(d => env[d.key]);
  const pts = vals.map((v, i) => {
    const a = -Math.PI / 2 + (i * Math.PI * 2) / vals.length;
    const rr = (v / 100) * r;
    return [cx + Math.cos(a) * rr, cy + Math.sin(a) * rr];
  });
  const path = pts.map((p, i) => `${i ? "L" : "M"}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(" ") + " Z";
  const rings = [0.33, 0.66, 1];
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {rings.map((k, idx) => {
        const ringPts = Array.from({ length: 6 }, (_, i) => {
          const a = -Math.PI / 2 + (i * Math.PI * 2) / 6;
          return `${cx + Math.cos(a) * r * k},${cy + Math.sin(a) * r * k}`;
        }).join(" ");
        return <polygon key={idx} points={ringPts} fill="none" stroke="rgba(8,16,40,0.08)" />;
      })}
      {axes.map((_, i) => {
        const a = -Math.PI / 2 + (i * Math.PI * 2) / 6;
        return <line key={i} x1={cx} y1={cy} x2={cx + Math.cos(a) * r} y2={cy + Math.sin(a) * r} stroke="rgba(8,16,40,0.06)" />;
      })}
      <path d={path} fill="rgba(33,81,245,0.16)" stroke="#2151F5" strokeWidth="1.5" />
      {pts.map((p, i) => (
        <circle key={i} cx={p[0]} cy={p[1]} r="2.5" fill="#2151F5" />
      ))}
      {axes.map((label, i) => {
        const a = -Math.PI / 2 + (i * Math.PI * 2) / 6;
        const lx = cx + Math.cos(a) * (r + 18);
        const ly = cy + Math.sin(a) * (r + 18);
        return <text key={i} x={lx} y={ly} fontSize="10" fontFamily="'Noto Sans TC', 'Inter', sans-serif"
          fill="rgba(54,65,89,0.7)" textAnchor="middle" dominantBaseline="middle">{label}</text>;
      })}
    </svg>
  );
}

function RoleBuilder({ onBack, onComplete }) {
  const [step, setStep] = _rbState(0);
  const [title, setTitle] = _rbState("後端工程師 L3");
  const [team, setTeam] = _rbState("平台組 · 6 人");
  const [env, setEnv] = _rbState({
    collab: 80, stress: 55, autonomy: 75, velocity: 60, scope: 60, ambig: 65
  });

  _rbEff(() => { if (window.lucide) lucide.createIcons(); }, [step, env]);

  const scored = MBTI.map(t => ({ t, s: rbScoreType(t, env) }));
  const fit = scored.filter(x => x.s >= 75).sort((a, b) => b.s - a.s);
  const risk = scored.filter(x => x.s < 55).sort((a, b) => a.s - b.s).slice(0, 3);

  const steps = [
    { key: "basics",   label: "基本資料" },
    { key: "env",      label: "環境維度" },
    { key: "review",   label: "確認送出" }
  ];

  return (
    <div className="hc-view rb">
      <div className="hc-crumb">
        <button className="hc-crumb__back" onClick={onBack}><i data-lucide="arrow-left"></i></button>
        <span className="hc-crumb__seg">職位環境</span>
        <i data-lucide="chevron-right" className="hc-crumb__sep"></i>
        <span className="hc-crumb__seg hc-crumb__seg--current">新建環境</span>
      </div>

      <div className="hc-page-head">
        <div>
          <Eyebrow>STEP 1 · 職位環境建模</Eyebrow>
          <h1 className="hc-h1">先定義環境，再定義人才。</h1>
          <p className="hc-page-head__sub">描述這個職位實際的工作方式，系統建立環境模型，預測哪些人格類型最適配——以及哪些帶有摩擦風險。</p>
        </div>
      </div>

      <div className="rb-stepper">
        {steps.map((s, i) => (
          <div key={s.key} className={`rb-step ${i === step ? "is-active" : ""} ${i < step ? "is-done" : ""}`} onClick={() => setStep(i)}>
            <span className="rb-step__num">{i < step ? "✓" : String(i + 1).padStart(2, "0")}</span>
            <span className="rb-step__label">{s.label}</span>
            {i < steps.length - 1 && <span className="rb-step__rule"></span>}
          </div>
        ))}
      </div>

      <div className="rb-grid">
        <div className="rb-form">
          {step === 0 && (
            <Card>
              <Eyebrow>基本資料</Eyebrow>
              <div className="rb-field">
                <label>職位名稱</label>
                <input className="rb-input" value={title} onChange={e => setTitle(e.target.value)} />
              </div>
              <div className="rb-field">
                <label>團隊背景</label>
                <input className="rb-input" value={team} onChange={e => setTeam(e.target.value)} />
                <span className="rb-hint">例：「平台組 · 6 人，非同步優先，RFC 配對評審」</span>
              </div>
              <div className="rb-field-row">
                <div className="rb-field">
                  <label>匯報對象</label>
                  <select className="rb-input">
                    <option>回報資深工程師</option>
                    <option>小組 Lead</option>
                    <option>部門主管</option>
                  </select>
                </div>
                <div className="rb-field">
                  <label>招募急迫性</label>
                  <select className="rb-input">
                    <option>30 天內</option>
                    <option>60 天內</option>
                    <option>90 天內</option>
                  </select>
                </div>
              </div>
              <div className="rb-actions">
                <span className="hc-muted hc-mono" style={{ fontSize: 12 }}>第 1 步，共 3 步</span>
                <span style={{ flex: 1 }}></span>
                <Button variant="primary" icon="arrow-right" onClick={() => setStep(1)}>繼續</Button>
              </div>
            </Card>
          )}

          {step === 1 && (
            <Card>
              <Eyebrow>環境維度</Eyebrow>
              <p className="rb-section-help">六個軸向。請滑動至這個職位實際的位置——而非理想中的位置。</p>
              <div className="rb-sliders">
                {RB_DIMS.map(d => (
                  <Slider key={d.key}
                    label={d.label} left={d.left} right={d.right}
                    iconL={d.iconL} iconR={d.iconR}
                    value={env[d.key]}
                    onChange={v => setEnv({ ...env, [d.key]: v })} />
                ))}
              </div>
              <div className="rb-actions">
                <Button variant="ghost" icon="arrow-left" onClick={() => setStep(0)}>返回</Button>
                <span style={{ flex: 1 }}></span>
                <Button variant="primary" icon="arrow-right" onClick={() => setStep(2)}>繼續</Button>
              </div>
            </Card>
          )}

          {step === 2 && (
            <Card>
              <Eyebrow>確認送出</Eyebrow>
              <div className="rb-review">
                <div className="rb-review__row"><span className="rb-review__k">職位</span><span className="rb-review__v">{title}</span></div>
                <div className="rb-review__row"><span className="rb-review__k">團隊</span><span className="rb-review__v">{team}</span></div>
                {RB_DIMS.map(d => (
                  <div key={d.key} className="rb-review__row">
                    <span className="rb-review__k">{d.label}</span>
                    <span className="rb-review__v hc-mono">{env[d.key]} · {env[d.key] >= 70 ? d.right : env[d.key] <= 30 ? d.left : "中間值"}</span>
                  </div>
                ))}
              </div>
              <div className="rb-review-cta">
                <div>
                  <div className="rb-review-cta__head">就緒，可以建模了。</div>
                  <div className="rb-review-cta__sub">系統將生成環境指紋、16 種人格的適配分佈，以及摩擦風險提示。約需 12 秒。</div>
                </div>
                <Button variant="primary" icon="sparkles" onClick={() => onComplete(title, env)}>建立環境模型</Button>
              </div>
              <div className="rb-actions">
                <Button variant="ghost" icon="arrow-left" onClick={() => setStep(1)}>返回</Button>
              </div>
            </Card>
          )}
        </div>

        <div className="rb-preview">
          <Card>
            <div className="hc-card__head">
              <Eyebrow signal>即時預覽 · 環境指紋</Eyebrow>
            </div>
            <div className="rb-fingerprint">
              <EnvFingerprint env={env} />
              <div className="rb-fingerprint__sum">
                <div className="rb-fingerprint__num"><span>{Math.round((env.collab + env.stress + env.velocity) / 3)}</span><span className="rb-fingerprint__numunit">/100</span></div>
                <div className="rb-fingerprint__lbl">綜合壓力指數</div>
                <div className="rb-fingerprint__hint">高協作密度與快速決策節奏拉高壓力，壓力基準屬中等。</div>
              </div>
            </div>
          </Card>

          <Card>
            <div className="hc-card__head">
              <Eyebrow>人格適配 · 16 型</Eyebrow>
              <span className="hc-card__hint hc-mono">model.v4.3</span>
            </div>
            <MBTIFitGrid env={env} />
            <div className="rb-callouts">
              <div className="rb-callout rb-callout--fit">
                <span className="rb-callout__hd"><span className="rb-callout__dot"></span>最佳適配</span>
                <div className="rb-callout__list">
                  {fit.slice(0, 4).map(x => <span key={x.t} className="rb-callout__type">{x.t} <span className="hc-mono hc-muted">{x.s}</span></span>)}
                  {fit.length === 0 && <span className="hc-muted hc-body-sm">此環境設定下無人格類型超過 75 門檻，請檢視配置是否符合實際情況。</span>}
                </div>
              </div>
              <div className="rb-callout rb-callout--risk">
                <span className="rb-callout__hd"><span className="rb-callout__dot"></span>摩擦風險</span>
                <div className="rb-callout__list">
                  {risk.map(x => <span key={x.t} className="rb-callout__type">{x.t} <span className="hc-mono hc-muted">{x.s}</span></span>)}
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

window.RoleBuilder = RoleBuilder;
