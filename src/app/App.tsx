import React, { useEffect } from "react";
import MainForm from "./views/MainForm";

const App = () => {
  useEffect(() => {
    window.ipcAPI.on.receiveDatafromJupyter((_, data) => {
      console.log(data);
    });
  }, []);
  return (
    <div>
      <MainForm />
    </div>
  );
};

export default App;
