import { BrowserView, BrowserWindow, dialog } from "electron";
import axios, { Method } from "axios";

import { Api } from "./api";
import db from "../db";

import { ipcMain } from "electron-typescript-ipc";

import { COLAB_SCRIPT, EVENT_SCRIPT, FETCH_SCRIPT } from "../scripts";

import Session, { Metrics } from "../models/session";

export const registerJupyterHandlers = (
  mainWindow: BrowserWindow,
  agentView: BrowserView,
  jupyterView: BrowserView
) => {
  //** Handler for submitting URLs.*/
  ipcMain.removeHandler<Api>("submitURLs");
  ipcMain.handle<Api>(
    "submitURLs",
    async (_event, serverURL: string, nbURL: string) => {
      // Load the notebook url.
      await jupyterView.webContents.loadURL(nbURL);

      // Load google colab handlers. Please see scripts/colab.js for more information.
      var script = COLAB_SCRIPT;
      await jupyterView.webContents.executeJavaScript(script);

      // Opens up the SSE Socket to the backend.
      var script = EVENT_SCRIPT;
      jupyterView.webContents.executeJavaScript(
        script
          .replace("%CLIENT_ID%", "abcd")
          .replace("%TEST_ID%", "507f1f77bcf86cd799439011")
          .replace("%SERVER_URL%", serverURL)
      );
      await Session.create({
        testId: "507f1f77bcf86cd799439011",
        clientId: "abcd",
        metrics: [],
      });
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
  // Handlers for on disk database.
  ipcMain.removeHandler<Api>("getDataFromStore"); // This is essential in case you are called multiple times.
  ipcMain.handle<Api>("getDataFromStore", async (_event, key: string) => {
    return db.confDB.get(key);
  });

  ipcMain.removeHandler<Api>("sendMetric");
  ipcMain.handle<Api>(
    "sendMetric",
    async (_event, clientId: string, testId: string, metric: Metrics) => {
      var session = await Session.findOne({
        where: {
          clientId,
          testId,
        },
      });
      session.metrics = [...session.metrics, metric];
      await session.save();
    }
  );
};

export const registerAxiosHandlers = (
  mainWindow?: BrowserWindow,
  agentView?: BrowserView,
  jupyterView?: BrowserView
) => {
  // Patch axios through the main thread.
  ipcMain.removeHandler<Api>("request"); // This is essential in case you are called multiple times.
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
