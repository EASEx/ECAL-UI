import { app, BrowserWindow, BrowserView } from "electron";
// This allows TypeScript to pick up the magic constant that's auto-generated by Forge's Webpack
// plugin that tells the Electron app where to look for the Webpack-bundled app code (depending on
// whether you're running in development or production).
import { registerHandlers } from "./api";
import ecalDB from "./db";
import Session from "./models/session";

declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  // eslint-disable-line global-require
  app.quit();
}

const createWindow = (): void => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    height: 600,
    width: 1200,
  });

  const agentView = new BrowserView({
    webPreferences: { preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY },
  });
  const jupyterView = new BrowserView({
    webPreferences: { preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY },
  });

  mainWindow.addBrowserView(agentView);
  mainWindow.addBrowserView(jupyterView);
  agentView.setAutoResize({
    width: true,
    height: true,
    horizontal: true,
    vertical: true,
  });
  jupyterView.setAutoResize({
    width: true,
    height: true,
    horizontal: true,
    vertical: true,
  });
  agentView.setBounds({ x: 0, y: 0, width: 600, height: 600 });
  jupyterView.setBounds({ x: 600, y: 0, width: 600, height: 600 });
  agentView.webContents.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
  jupyterView.webContents.loadURL("https://colab.research.google.com/");

  jupyterView.webContents.openDevTools();
  agentView.webContents.openDevTools();

  mainWindow.on("ready-to-show", () => {
    registerHandlers(mainWindow, agentView, jupyterView);
    ecalDB.sequelize.sync()
    var ns = Session.build()
    ns.options = ["a", "b"]
    ns.save()
  });
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
