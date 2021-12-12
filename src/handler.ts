import { BrowserView, BrowserWindow, Menu, app, dialog, shell } from "electron";
import axios, { Method } from "axios";

import { Api } from "./api";
import db from "./db";

import defaultMenu from "electron-default-menu";
import fs from "fs"
import { ipcMain } from "electron-typescript-ipc"
import path from "path"

const registerHandlers = (mainWindow: BrowserWindow, agentView: BrowserView, jupyterView: BrowserView) => {
    var script = fs.readFileSync(path.join(__dirname, 'scripts', 'colab.js'), 'utf-8')
    jupyterView.webContents.executeJavaScript(script)

    ipcMain.removeHandler<Api>('getDatafromJupyter')
    ipcMain.removeHandler<Api>('sendDatafromJupyter')
    ipcMain.handle<Api>('getDatafromJupyter', async (_event) => {
        console.log('Main Process sending askData event on receiving getData')
        return jupyterView.webContents.send('askDatafromJupyter')
    })
    ipcMain.handle<Api>('sendDatafromJupyter', async (_event, data) => {
        return agentView.webContents.send('receiveDatafromJupyter', data)
    })


    ipcMain.removeHandler<Api>('getDataFromStore'); // This is essential in case you are called multiple times.
    ipcMain.handle<Api>('getDataFromStore', async (_event, key) => {
        return db.get(key)
    });



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

const registerMenu = (agentView?: BrowserView, jupyterView?: BrowserView) => {
    const menu = defaultMenu(app, shell);

    // Add custom menu
    menu.splice(4, 0, {
        label: 'Custom',
        submenu: [
            {
                label: 'Do something',
                click: (item, focusedWindow) => {
                    dialog.showMessageBox({ message: 'Do something', buttons: ['OK'] });
                }
            },
            {
                label: "Reload",
                click: () => {
                    jupyterView.webContents.reload()
                }
            }
        ]
    });



    // Set application menu
    Menu.setApplicationMenu(Menu.buildFromTemplate(menu));
}
export { registerHandlers, registerMenu }