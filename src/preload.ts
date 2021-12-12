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
        getDatafromJupyter: async () => {
            return await ipcRenderer.invoke<Api>('getDatafromJupyter')
        },
        sendDatafromJupyter: async (data: any) => {
            return await ipcRenderer.invoke<Api>('sendDatafromJupyter', data)
        }
    },
    on: {
        showAlert: (listener) => {
            ipcRenderer.on<Api>('showAlert', listener);
        },
        logNotebookCells: (listener) => {
            ipcRenderer.on<Api>('logNotebookCells', listener);
        },
        askDatafromJupyter: (listener) => {
            ipcRenderer.on<Api>('askDatafromJupyter', listener)
        },
        receiveDatafromJupyter: (listener) => {
            ipcRenderer.on<Api>('receiveDatafromJupyter', listener)
        }
    },
};

contextBridge.exposeInMainWorld('ipcAPI', api);
