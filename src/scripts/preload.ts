import { contextBridge, ipcRenderer } from 'electron-typescript-ipc';
import { Api } from '../api';

const api: Api = {
    invoke: {
        getDataFromStore: async (key: string) => {
            return await ipcRenderer.invoke<Api>('getDataFromStore', key);
        },
        submitURLs: async (serverURL: string, nbURL: string) => {
            return await ipcRenderer.invoke<Api>('submitURLs', serverURL, nbURL);
        }
    },
    on: {
        showAlert: (listener) => {
            ipcRenderer.on<Api>('showAlert', listener);
        },
    },

};

contextBridge.exposeInMainWorld('myAPI', api);