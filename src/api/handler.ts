import axios, { Method } from "axios";
import { BrowserView, BrowserWindow, dialog } from "electron";
import { ipcMain } from "electron-typescript-ipc";

import MetricNode, { Metric } from "../models/session";
import { COLAB_SCRIPT, EVENT_SCRIPT, FETCH_SCRIPT } from "../scripts";
import { Api } from "../api";
import ecalDB from "../db";

export const registerJupyterHandlers = (
  mainWindow: BrowserWindow,
  agentView: BrowserView,
  jupyterView: BrowserView
) => {
  ipcMain.removeHandler<Api>("submitURLs");
  ipcMain.handle<Api>(
    "submitURLs",
    async (_event, serverURL: string, nbURL: string) => {
      await jupyterView.webContents.loadURL(nbURL);
      var script = COLAB_SCRIPT;
      await jupyterView.webContents.executeJavaScript(script);
      var script = EVENT_SCRIPT;
      jupyterView.webContents.executeJavaScript(
        script
          .replace("%CLIENT_ID%", "abcd")
          .replace("%TEST_ID%", "507f1f77bcf86cd799439011")
          .replace("%SERVER_URL%", serverURL)
      );
      await ecalDB.aceDB
        .ref("tests/507f1f77bcf86cd799439011/sessions/abcd/metrics")
        .set({});
    }
  );

  ipcMain.removeHandler<Api>("sendWarning");
  ipcMain.handle<Api>("sendWarning", async (_event, warning: string) => {
    return await dialog.showMessageBox(mainWindow, {
      title: "Jupyter Notebook Modified",
      message: warning,
    });
  });

  ipcMain.removeHandler<Api>("sendAction");
  ipcMain.handle<Api>("sendAction", async (_event, action: string) => {
    await jupyterView.webContents.executeJavaScript(FETCH_SCRIPT);
    return agentView.webContents.send("renderAction", action);
  });
};

export const registerDatabaseHandlers = (
  mainWindow?: BrowserWindow,
  agentView?: BrowserView,
  jupyterView?: BrowserView
) => {
  ipcMain.removeHandler<Api>("getDataFromStore");
  ipcMain.handle<Api>("getDataFromStore", async (_event, key: string) => {
    return ecalDB.confDB.get(key);
  });

  ipcMain.removeHandler<Api>("sendMetric");
  ipcMain.handle<Api>(
    "sendMetric",
    async (_event, clientId: string, testId: string, metric: Metric) => {
      console.log(metric);
      console.log("Node created!");
      await ecalDB.aceDB
        .ref(`tests/${testId}/sessions/${clientId}/metrics`)
        .push(new MetricNode(metric));
    }
  );
};

export const registerAxiosHandlers = (
  mainWindow?: BrowserWindow,
  agentView?: BrowserView,
  jupyterView?: BrowserView
) => {
  // Patch axios through the main thread.
  ipcMain.removeHandler<Api>("request");
  ipcMain.handle<Api>(
    "request",
    async (_event, url: string, data: any, method: Method) => {
      const response = await axios.request({
        method: method,
        data: data,
        url: url,
      });
      return { data: response.data || {}, status: response.status };
    }
  );
};
