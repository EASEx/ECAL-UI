import { BrowserView, BrowserWindow } from "electron"
import { registerAxiosHandlers, registerDatabaseHandlers, registerJupyterHandlers } from "./handler"
import { registerMenu } from "./menu"
import ecalSocket, { registerSocketHandlers } from "./socket"
import { Api } from "./api"


const registerHandlers = (mainWindow: BrowserWindow, agentView: BrowserView, jupyterView: BrowserView) => {
    registerJupyterHandlers(mainWindow, agentView, jupyterView)
    registerAxiosHandlers()
    registerSocketHandlers()
    registerDatabaseHandlers()
    registerMenu()
}

export { ecalSocket, registerHandlers, Api }