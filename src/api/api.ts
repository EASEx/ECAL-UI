import { Method } from 'axios';
import { GetApiType } from 'electron-typescript-ipc';

export type Api = GetApiType<
    {
        getDataFromStore: (str: string) => Promise<string>;
        submitURLs: (serverURL: string, nbURL: string) => Promise<string>;
        request: (url: string, data: any, method: Method) => Promise<any>
        getDatafromJupyter: () => Promise<any>
        sendDatafromJupyter: (data: any) => Promise<{ data: any, status: number | undefined }>
    },
    {
        askDatafromJupyter: () => Promise<void>
        receiveDatafromJupyter: (data: any) => Promise<void>
    }
>;



declare global {
    interface Window {
        ipcAPI: Api;
    }
}

