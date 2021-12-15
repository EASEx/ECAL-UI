import React from "react";
import { useRecoilValue } from "recoil";
import { ROUTE } from "./store";
import BotPage from "./views/Bot";
import MainForm from "./views/MainForm";

const App = () => {
  const route = useRecoilValue(ROUTE);
  const getPage = (route: string) => {
    switch (route) {
      case "/":
        return <MainForm />;

      case "/bot":
        return <BotPage />;

      default:
        return <MainForm />;
    }
  };
  return <div>{getPage(route)}</div>;
};

export default App;
