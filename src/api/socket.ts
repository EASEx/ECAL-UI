import { io } from "socket.io-client"

const ecalSocket = io("http://localhost:5000")

export const registerSocketHandlers = () => {
    ecalSocket.connect()
    ecalSocket.onAny((...args) => {
        console.log(args)
    })
}

export default ecalSocket