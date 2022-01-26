import { contextBridge, ipcRenderer } from 'electron-typescript-ipc';
import { Api } from './api';
import { Method } from 'axios';


const api: Api = {
    invoke: {
        getDataFromStore: async (key: string) => {
            return await ipcRenderer.invoke<Api>('getDataFromStore', key);
        },
        submitURLs: async (serverURL: string, nbURL: string) => {
            return await ipcRenderer.invoke<Api>('submitURLs', serverURL, nbURL);
        },
        request: async (url: string, data: any, method: Method) => {
            return await ipcRenderer.invoke<Api>('request', url, data, method)
        },
        sendWarning: async (warning: string) => {
            return await ipcRenderer.invoke<Api>('sendWarning', warning)
        },
        sendAction: async (warning: string) => {
            return await ipcRenderer.invoke<Api>('sendAction', warning)
        }
    },
    on: {
        renderAction: (listener) => {
            ipcRenderer.on<Api>('renderAction', listener)
        }
    },
};

contextBridge.exposeInMainWorld('ipcAPI', api);
