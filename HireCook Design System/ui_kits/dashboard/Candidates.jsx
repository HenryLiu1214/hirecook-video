// Candidates.jsx — list view
const STATUS_LABEL = { fit: "適配", watch: "留意", risk: "高風險" };

function CandidateRow({ c, onOpen }) {
  return (
    <tr className="hc-row" onClick={() => onOpen(c.id)}>
      <td>
        <div className="hc-cell-name">
          <div className="hc-avatar hc-avatar--sm">{c.initials}</div>
          <div className="hc-col">
            <div className="hc-cell-name__main">{c.name}</div>
            <div className="hc-cell-name__sub">{c.id} · {c.sjt}</div>
          </div>
        </div>
      </td>
      <td className="hc-mono">{c.role}</td>
      <td>
        <Chip status={c.status} dot>{STATUS_LABEL[c.status]}</Chip>
      </td>
      <td className="hc-num">{c.score.toFixed(1)} <span className="hc-num__unit">/100</span></td>
      <td className="hc-num">{c.retention6mo}<span className="hc-num__unit">%</span></td>
      <td className="hc-mono hc-muted">± {c.ci.toFixed(1)}</td>
      <td className="hc-mono hc-muted">{c.days} 天前</td>
      <td className="hc-row__chev"><i data-lucide="chevron-right"></i></td>
    </tr>
  );
}

function Candidates({ onOpenCandidate }) {
  const candidates = window.HC_DATA.candidates;
  const fit   = candidates.filter(c => c.status === "fit").length;
  const watch = candidates.filter(c => c.status === "watch").length;
  const risk  = candidates.filter(c => c.status === "risk").length;
  const avg = (candidates.reduce((s, c) => s + c.score, 0) / candidates.length).toFixed(1);

  return (
    <div className="hc-view">
      <div className="hc-page-head">
        <div>
          <Eyebrow>工作區</Eyebrow>
          <h1 className="hc-h1">候選人</h1>
          <p className="hc-page-head__sub">{candidates.length} 位候選人在 {window.HC_DATA.roles.length} 個職位環境中完成行為預測。</p>
        </div>
        <div className="hc-page-head__cta">
          <Button variant="ghost" icon="filter">篩選</Button>
          <Button variant="secondary" icon="download">匯出 TAT</Button>
          <Button variant="primary" icon="plus">邀請候選人</Button>
        </div>
      </div>

      <div className="hc-kpi-row">
        <KPI eyebrow="P × E 適配均值" value={avg} unit="/100" sub="± 3.6 信賴區間" delta="+4.2" signal />
        <KPI eyebrow="高適配"    value={fit}   unit={`/ ${candidates.length}`} sub="分數 ≥ 75" />
        <KPI eyebrow="留意"      value={watch} unit={`/ ${candidates.length}`} sub="有顯著落差" />
        <KPI eyebrow="高風險"    value={risk}  unit={`/ ${candidates.length}`} sub="留任率 < 50%" delta="-1" />
      </div>

      <Card padding={0}>
        <div className="hc-tablehead">
          <div className="hc-tabs">
            <button className="hc-tabs__tab is-active">全部 <span className="hc-tabs__count">{candidates.length}</span></button>
            <button className="hc-tabs__tab">高適配 <span className="hc-tabs__count">{fit}</span></button>
            <button className="hc-tabs__tab">留意 <span className="hc-tabs__count">{watch}</span></button>
            <button className="hc-tabs__tab">高風險 <span className="hc-tabs__count">{risk}</span></button>
          </div>
          <div className="hc-tablehead__right">
            <span className="hc-mono hc-muted">依分數排序 · 由高到低</span>
          </div>
        </div>

        <table className="hc-table">
          <thead>
            <tr>
              <th>候選人</th>
              <th>職位環境</th>
              <th>狀態</th>
              <th className="hc-num">P × E 適配</th>
              <th className="hc-num">6 個月留任率</th>
              <th>信賴區間</th>
              <th>測驗時間</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {[...candidates].sort((a, b) => b.score - a.score).map(c =>
              <CandidateRow key={c.id} c={c} onOpen={onOpenCandidate} />
            )}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

window.Candidates = Candidates;
