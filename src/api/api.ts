import { Method } from "axios";
import { GetApiType } from "electron-typescript-ipc";
import { Metrics } from "../models/session";

export type Api = GetApiType<
  {
    getDataFromStore: (str: string) => Promise<string>;
    submitURLs: (serverURL: string, nbURL: string) => Promise<string>;
    request: (url: string, data: any, method: Method) => Promise<any>;
    sendWarning: (warning: string) => Promise<void>;
    sendAction: (action: string) => Promise<void>;
    sendMetric: (
      client_id: string,
      test_id: string,
      metric: Metrics
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
