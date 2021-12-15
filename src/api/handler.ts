import { BrowserView, BrowserWindow, } from "electron";
import axios, { Method } from "axios";

import { Api } from "./api";
import db from "../db";

import fs from "fs"
import { ipcMain } from "electron-typescript-ipc"
import path from "path"
import { ecalSocket } from ".";
import ecalDB from "../db";

export const registerJupyterHandlers = (mainWindow: BrowserWindow, agentView: BrowserView, jupyterView: BrowserView) => {

    var script = fs.readFileSync(path.join(__dirname, 'scripts', 'colab.js'), 'utf-8')
    jupyterView.webContents.executeJavaScript(script)

    ipcMain.removeHandler<Api>('sendDatafromJupyter')
    ipcMain.handle<Api>('sendDatafromJupyter', async (_event, data) => {
        ecalSocket.emit('jupyter_pong', { "metrics": data })
    })

    ipcMain.removeHandler<Api>('submitURLs')
    ipcMain.handle<Api>('submitURLs', async (_event, serverURL, nbURL) => {
        await jupyterView.webContents.loadURL(nbURL);
        ecalSocket.connect()
    })
}

export const registerDatabaseHandlers = (mainWindow?: BrowserWindow, agentView?: BrowserView, jupyterView?: BrowserView) => {

    // Handlers for on disk database. 
    ipcMain.removeHandler<Api>('getDataFromStore'); // This is essential in case you are called multiple times.
    ipcMain.handle<Api>('getDataFromStore', async (_event, key) => {
        return db.confDB.get(key)
    });
}

export const registerAxiosHandlers = (mainWindow?: BrowserWindow, agentView?: BrowserView, jupyterView?: BrowserView) => {

    // Patch axios through the main thread.
    ipcMain.removeHandler<Api>('request'); // This is essential in case you are called multiple times.
    ipcMain.handle<Api>('request', async (_event, url: string, data: any, method: Method) => {
        const response = await axios.request({
            method: method,
            data: data,
            url: url
        })
        return { data: response.data || {}, status: response.status }
    })

}


