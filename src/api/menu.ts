import { BrowserView, Menu, app, dialog, shell } from "electron";

import defaultMenu from "electron-default-menu";


export const registerMenu = (agentView?: BrowserView, jupyterView?: BrowserView) => {
    const menu = defaultMenu(app, shell);

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

    Menu.setApplicationMenu(Menu.buildFromTemplate(menu));
}

