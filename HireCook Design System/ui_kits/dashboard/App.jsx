// App.jsx — top-level state + route switching
const { useState: _useState, useEffect: _useEffect } = React;

function App() {
  const [route, setRoute] = _useState({ view: "pipeline" });

  _useEffect(() => { if (window.lucide) lucide.createIcons(); }, [route]);

  let screen = null;
  let chromeless = false;

  if (route.view === "pipeline") {
    screen = <Pipeline setRoute={setRoute} />;
  } else if (route.view === "candidates") {
    screen = <Candidates onOpenCandidate={(id) => setRoute({ view: "candidate", id })} />;
  } else if (route.view === "candidate") {
    screen = <TATPlaybook candidateId={route.id} onBack={() => setRoute({ view: "candidates" })} />;
  } else if (route.view === "roles") {
    screen = <Roles onNew={() => setRoute({ view: "role-builder" })} />;
  } else if (route.view === "role-builder") {
    screen = <RoleBuilder
      onBack={() => setRoute({ view: "roles" })}
      onComplete={(title, env) => setRoute({ view: "role-result", title, env })} />;
  } else if (route.view === "role-result") {
    screen = <RoleResult title={route.title} env={route.env} setRoute={setRoute} />;
  } else if (route.view === "sjt-take") {
    chromeless = true;
    screen = <SJTAssessment
      onExit={() => setRoute({ view: "pipeline" })}
      onComplete={() => setRoute({ view: "sjt-done" })} />;
  } else if (route.view === "sjt-done") {
    chromeless = true;
    screen = <SJTDone onReturn={() => setRoute({ view: "pipeline" })} />;
  } else if (route.view === "insights") {
    screen = (
      <div className="hc-view hc-empty">
        <div className="hc-empty__mark">
          <img src={window.__resources?.logoMark || "../../assets/logo-mark.svg"} width="64" height="64" alt="" />
        </div>
        <h1 className="hc-h1">洞察報告</h1>
        <p className="hc-empty__copy">跨職位的留任趨勢、模型漂移與 SJT 校準視圖將呈現於此區塊。Dashboard 目前已開放流程總覽、候選人與職位環境三個功能。</p>
        <Button variant="secondary" onClick={() => setRoute({ view: "pipeline" })}>回到流程總覽</Button>
      </div>
    );
  }

  if (chromeless) return screen;

  return <Frame route={route} setRoute={setRoute}>{screen}</Frame>;
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
