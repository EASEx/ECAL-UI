import { app, shell, BrowserView, BrowserWindow, dialog, Menu } from "electron";
import defaultMenu from "electron-default-menu";
import { ipcMain } from "electron-typescript-ipc"
import { Api } from "./api";

const registerHandlers = (mainWindow: BrowserWindow, agentView: BrowserView, jupyterView: BrowserView) => {
    ipcMain.removeHandler<Api>('getDataFromStore'); // This is essential in case you are called multiple times.
    ipcMain.handle<Api>('getDataFromStore', async (_event, key) => {
        console.log(key)
        jupyterView.webContents.reload()
        return "from";
    });
    ipcMain.send<Api>(mainWindow, 'showAlert', 'Hi', 1000)
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