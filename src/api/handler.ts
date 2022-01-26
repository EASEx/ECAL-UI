import { BrowserView, BrowserWindow, dialog, } from "electron";
import axios, { Method } from "axios";

import { Api } from "./api";
import db from "../db";

import fs from "fs"
import { ipcMain } from "electron-typescript-ipc"
import path from "path"
import ecalDB from "../db";

import { COLAB_SCRIPT, EVENT_SCRIPT } from "../scripts"

export const registerJupyterHandlers = (mainWindow: BrowserWindow, agentView: BrowserView, jupyterView: BrowserView) => {

    // var script = fs.readFileSync(path.join(__dirname, 'scripts', 'colab.js'), 'utf-8')
    // jupyterView.webContents.executeJavaScript(script)
    // console.log()


    ipcMain.removeHandler<Api>('submitURLs')
    ipcMain.handle<Api>('submitURLs', async (_event, serverURL, nbURL) => {

        await jupyterView.webContents.loadURL(nbURL);

        var script = COLAB_SCRIPT;
        await jupyterView.webContents.executeJavaScript(script)

        var script = EVENT_SCRIPT;

        jupyterView.webContents.executeJavaScript(script.replace("%CLIENT_ID%", "abcd").replace("%TEST_ID%", "507f1f77bcf86cd799439011").replace("%SERVER_URL%", serverURL))



        agentView.webContents.send("openSSESocket", `${serverURL}?id=abcd&test_id=507f1f77bcf86cd799439011&client=agent`)
    })

    ipcMain.removeHandler<Api>('sendWarning')
    ipcMain.handle<Api>('sendWarning', async (_event, warning: string) => {
        // ecalSocket.emit('warning', { warning, timestamp: new Date().toTimeString() })
        return await dialog.showMessageBox(mainWindow, {
            title: 'Jupyter Notebook Modified',
            message: warning
        })
    })

    ipcMain.removeHandler<Api>('sendAction')
    ipcMain.handle<Api>('sendAction', async (_event, action: string) => {
        return agentView.webContents.send('renderAction', action)
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


