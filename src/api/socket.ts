import { BrowserView, BrowserWindow } from "electron"
import { io } from "socket.io-client"

const ecalSocket = io("http://localhost:5000", {
    reconnection: true,
    autoConnect: false
})


export const registerSocketHandlers = (mainWindow: BrowserWindow, agentView: BrowserView, jupyterView: BrowserView) => {


    ecalSocket.on('jupyter_ping', () => {
        console.log('WS asking for Jupyter Metric')
        jupyterView.webContents.send('askDatafromJupyter')
    })
    ecalSocket.on('connect', () => {
        ecalSocket.emit('join_session', { 'url': jupyterView.webContents.getURL() })
    })
}

export default ecalSocket