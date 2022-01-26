import { BrowserView, BrowserWindow } from "electron"
import { registerAxiosHandlers, registerDatabaseHandlers, registerJupyterHandlers } from "./handler"
import { registerMenu } from "./menu"
import { Api } from "./api"


const registerHandlers = (mainWindow: BrowserWindow, agentView: BrowserView, jupyterView: BrowserView) => {
    registerJupyterHandlers(mainWindow, agentView, jupyterView)
    registerAxiosHandlers()
    registerDatabaseHandlers()
    registerMenu()
}

export { registerHandlers, Api }