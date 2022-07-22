import React, { useEffect } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";

import { CURRENT_ACTION, ROUTE } from "./store";
import BotPage from "./views/Bot";
import MainForm from "./views/MainForm";

const App = () => {
  const route = useRecoilValue(ROUTE);
  const setAction = useSetRecoilState(CURRENT_ACTION);
  useEffect(() => {
    window.ipcAPI.on.renderAction((ev, data) => {
      setAction(data);
    });
  });
  const getPage = (route: string) => {
    switch (route) {
      case "/":
        return <MainForm />;

      case "/bot":
        return <MainForm />;

      default:
        return <MainForm />;
    }
  };
  return <div>{getPage(route)}</div>;
};

export default App;
