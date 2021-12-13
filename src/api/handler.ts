import { BrowserView, BrowserWindow, } from "electron";
import axios, { Method } from "axios";

import { Api } from "./api";
import db from "../db";

import fs from "fs"
import { ipcMain } from "electron-typescript-ipc"
import path from "path"

export const registerJupyterHandlers = (mainWindow: BrowserWindow, agentView: BrowserView, jupyterView: BrowserView) => {

    var script = fs.readFileSync(path.join(__dirname, 'scripts', 'colab.js'), 'utf-8')
    jupyterView.webContents.executeJavaScript(script)

    // Register Handlers for Jupyter Cell Data.
    ipcMain.removeHandler<Api>('getDatafromJupyter')
    ipcMain.removeHandler<Api>('sendDatafromJupyter')
    ipcMain.handle<Api>('getDatafromJupyter', async (_event) => {
        console.log('Main Process sending askData event on receiving getData')
        return jupyterView.webContents.send('askDatafromJupyter')
    })
    ipcMain.handle<Api>('sendDatafromJupyter', async (_event, data) => {
        return agentView.webContents.send('receiveDatafromJupyter', data)
    })
}

export const registerDatabaseHandlers = (mainWindow?: BrowserWindow, agentView?: BrowserView, jupyterView?: BrowserView) => {

    // Handlers for on disk database. 
    ipcMain.removeHandler<Api>('getDataFromStore'); // This is essential in case you are called multiple times.
    ipcMain.handle<Api>('getDataFromStore', async (_event, key) => {
        return db.get(key)
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


