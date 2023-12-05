import { Show, lazy } from "solid-js";
import { Route, Router, Routes } from "@solidjs/router";
import { render } from "solid-js/web";
import history from "./history";
import "./index.scss";
import Loader from "./views/Loader";
import InxView from "./views/InxView";
import { Toaster } from "solid-toast";

function renderApp() {
  render(
    () => (
      <Suspense fallback={() => <Loader />}>
        <Router history={history}>
          <Routes>
            <Route path="/" component={InxView} />
          </Routes>
        </Router>
        <Toaster
          position="top-right"
          gutter={8}
          toastOptions={{
            style: { width: "40%" },
          }}
        />
      </Suspense>
    ),
    document.getElementById("root")
  );
}

history.listen(({ action, location }) => {
  window.scrollTo(0, 0);
  if (["POP"].includes(action)) {
    history.go(0);
  }
  if (["PUSH"].includes(action)) {
    document.getElementById("root").innerHTML = "";
    renderApp();
  }
});

renderApp();
