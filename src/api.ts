import { GetApiType } from 'electron-typescript-ipc';

export type Api = GetApiType<
    {
        getDataFromStore: (str: string) => Promise<string>;
        submitURLs: (serverURL: string, nbURL: string) => Promise<string>
    },
    {
        showAlert: (text: string, num: number) => Promise<void>;
    }
>;

declare global {
    interface Window {
        myAPI: Api;
    }
}