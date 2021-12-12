import * as React from "react";
import * as ReactDOM from "react-dom";
import { RecoilRoot } from "recoil";
import App from "./App";
import "antd/dist/antd.css"; // or 'antd/dist/antd.less'

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

window.ipcAPI.on.receiveDatafromJupyter((e, data) => {
  console.log(data);
});

render();
