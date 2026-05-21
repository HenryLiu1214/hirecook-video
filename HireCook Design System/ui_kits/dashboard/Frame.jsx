// Frame.jsx — persistent sidebar + topbar shell. Globals: Frame.
const { useEffect } = React;

function NavItem({ icon, label, active, badge, onClick }) {
  return (
    <button className={`hc-nav__item ${active ? "is-active" : ""}`} onClick={onClick}>
      <i data-lucide={icon}></i>
      <span>{label}</span>
      {badge != null && <span className="hc-nav__badge">{badge}</span>}
    </button>
  );
}

function Frame({ route, setRoute, children }) {
  // Re-render lucide icons whenever the frame re-renders or children change.
  useEffect(() => { if (window.lucide) lucide.createIcons(); });

  return (
    <div className="hc-app">
      {/* Sidebar */}
      <aside className="hc-side">
        <div className="hc-side__brand">
          <img src={window.__resources?.logoMark || "../../assets/logo-mark.svg"} width="28" height="28" alt="" />
          <div className="hc-side__brandtext">
            <div className="hc-side__brandname">HireCook</div>
            <div className="hc-side__brandsub">{window.HC_DATA.workspace.name}</div>
          </div>
        </div>

        <div className="hc-side__section">
          <div className="hc-eyebrow hc-side__heading">工作區</div>
          <NavItem icon="git-fork" label="流程總覽" active={route.view === "pipeline"} onClick={() => setRoute({ view: "pipeline" })} />
          <NavItem icon="users" label="候選人" active={route.view === "candidates" || route.view === "candidate"} badge={5} onClick={() => setRoute({ view: "candidates" })} />
          <NavItem icon="layers" label="職位環境" active={route.view === "roles" || route.view === "role-builder"} badge={4} onClick={() => setRoute({ view: "roles" })} />
          <NavItem icon="bar-chart-3" label="洞察報告" onClick={() => setRoute({ view: "insights" })} active={route.view === "insights"} />
        </div>

        <div className="hc-side__section">
          <div className="hc-eyebrow hc-side__heading">系統</div>
          <NavItem icon="brain-circuit" label="評測模型" />
          <NavItem icon="git-branch" label="SJT 批次" />
          <NavItem icon="shield-check" label="稽核紀錄" />
        </div>

        <div className="hc-side__footer">
          <div className="hc-side__model">
            <span className="hc-signal-dot"></span>
            <div className="hc-side__modeltxt">
              <div>model.v4.3</div>
              <div className="hc-side__modelsub">sjt-3.1 · ready</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main column */}
      <main className="hc-main">
        <header className="hc-top">
          <div className="hc-top__search">
            <i data-lucide="search"></i>
            <input placeholder="搜尋候選人、職位、模型…" />
            <span className="hc-kbd">⌘K</span>
          </div>
          <div className="hc-top__actions">
            <Chip status="signal" dot>推論中</Chip>
            <IconBtn icon="bell" label="Notifications" />
            <IconBtn icon="settings-2" label="Settings" />
            <div className="hc-avatar">YC</div>
          </div>
        </header>

        <div className="hc-content">{children}</div>
      </main>
    </div>
  );
}

window.Frame = Frame;
