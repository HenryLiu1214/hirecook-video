// Roles.jsx — list of modeled role environments
function RoleCard({ r }) {
  return (
    <Card>
      <div className="hc-role__head">
        <Eyebrow>職位環境 · {r.modeledAt}</Eyebrow>
        <Chip status="neutral" icon="layers">{r.candidates} 位候選人</Chip>
      </div>
      <div className="hc-h2" style={{ marginTop: 8 }}>{r.title}</div>
      <div className="hc-role__sub">{r.team}</div>
      <div className="hc-role__grid">
        <div><span className="hc-role__k">壓力</span><span>{r.stress}</span></div>
        <div><span className="hc-role__k">協作</span><span>{r.collab}</span></div>
        <div><span className="hc-role__k">自主性</span><span>{r.autonomy}</span></div>
        <div><span className="hc-role__k">決策模式</span><span>{r.decisions}</span></div>
      </div>
      <div className="hc-role__foot">
        <button className="hc-link">開啟環境 <i data-lucide="arrow-right"></i></button>
      </div>
    </Card>
  );
}

function Roles({ onNew }) {
  const roles = window.HC_DATA.roles;
  return (
    <div className="hc-view">
      <div className="hc-page-head">
        <div>
          <Eyebrow>工作區</Eyebrow>
          <h1 className="hc-h1">職位環境</h1>
          <p className="hc-page-head__sub">每個環境模型編碼了該職位的團隊結構、協作密度、壓力節奏與決策模式，預測在此環境中運行。</p>
        </div>
        <div className="hc-page-head__cta">
          <Button variant="ghost" icon="filter">篩選</Button>
          <Button variant="primary" icon="plus" onClick={onNew}>建立職位環境</Button>
        </div>
      </div>

      <div className="hc-roles-grid">
        {roles.map(r => <RoleCard key={r.id} r={r} />)}
        <Card className="hc-role--new">
          <div className="hc-role-new">
            <div className="hc-role-new__mark"><i data-lucide="plus"></i></div>
            <div className="hc-h3">建立新職位環境</div>
            <p className="hc-role-new__copy">描述團隊結構、協作密度、壓力節奏與決策模式，系統將在一分鐘內建立環境模型。</p>
            <Button variant="secondary" icon="arrow-right" onClick={onNew}>開始環境建模</Button>
          </div>
        </Card>
      </div>
    </div>
  );
}

window.Roles = Roles;
