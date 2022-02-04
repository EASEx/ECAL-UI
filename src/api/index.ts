import { BrowserView, BrowserWindow } from "electron";

import {
  registerAxiosHandlers,
  registerDatabaseHandlers,
  registerJupyterHandlers,
} from "../api/handler";
import { registerMenu } from "../api/menu";

import { Method } from "axios";
import { GetApiType } from "electron-typescript-ipc";

import { Metric } from "../models/session";

type Api = GetApiType<
  {
    getDataFromStore: (str: string) => Promise<string>;
    submitURLs: (serverURL: string, nbURL: string) => Promise<string>;
    request: (url: string, data: any, method: Method) => Promise<any>;
    sendWarning: (warning: string) => Promise<void>;
    sendAction: (action: string) => Promise<void>;
    sendMetric: (
      client_id: string,
      test_id: string,
      metric: Metric
    ) => Promise<void>;
  },
  {
    renderAction: (data: string) => Promise<void>;
  }
>;

declare global {
  interface Window {
    ipcAPI: Api;
  }
}

const registerHandlers = (
  mainWindow: BrowserWindow,
  agentView: BrowserView,
  jupyterView: BrowserView
) => {
  registerJupyterHandlers(mainWindow, agentView, jupyterView);
  registerAxiosHandlers();
  registerDatabaseHandlers();
  registerMenu();
};

export { Api, registerHandlers };
