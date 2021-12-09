import * as React from "react";
import * as ReactDOM from "react-dom";
import { RecoilRoot } from "recoil";
import App from "./App";

function render() {
  ReactDOM.render(
    <React.StrictMode>
      <RecoilRoot>
        <App />
      </RecoilRoot>
    </React.StrictMode>,
    document.getElementById("root")
  );
}

render();
