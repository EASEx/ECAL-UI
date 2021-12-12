import React, { useEffect } from "react";
import ecalSocket from "./api/socket";
import MainForm from "./views/MainForm";

const App = () => {
  useEffect(() => {
    ecalSocket.connect();
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
