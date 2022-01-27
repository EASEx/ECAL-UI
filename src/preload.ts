import { contextBridge, ipcRenderer } from "electron-typescript-ipc";
import { Api } from "./api";
import { Method } from "axios";
import { Metrics } from "./models/session";

const api: Api = {
  invoke: {
    getDataFromStore: async (key: string) => {
      return await ipcRenderer.invoke<Api>("getDataFromStore", key);
    },
    submitURLs: async (serverURL: string, nbURL: string) => {
      return await ipcRenderer.invoke<Api>("submitURLs", serverURL, nbURL);
    },
    request: async (url: string, data: any, method: Method) => {
      return await ipcRenderer.invoke<Api>("request", url, data, method);
    },
    sendWarning: async (warning: string) => {
      return await ipcRenderer.invoke<Api>("sendWarning", warning);
    },
    sendAction: async (warning: string) => {
      return await ipcRenderer.invoke<Api>("sendAction", warning);
    },
    sendMetric: async (client_id: string, test_id: string, metric: Metrics) => {
      return await ipcRenderer.invoke<Api>(
        "sendMetric",
        client_id,
        test_id,
        metric
      );
    },
  },
  on: {
    renderAction: (listener) => {
      ipcRenderer.on<Api>("renderAction", listener);
    },
  },
};

contextBridge.exposeInMainWorld("ipcAPI", api);
