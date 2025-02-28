import { Server } from "socket.io"
import { decodeTokenSocket } from "../../services/decodeToken.js"
import { logOutAccount, registerAccount } from "./services/chat.socket.service.js"
import { sendMessages } from "./services/message.services.js"

export const runIo=async(server)=>{
    const io =new Server(server,{
        cors:'*'
    })
   
    io.on('connection',async(socket)=>{
        await registerAccount(socket)
        await logOutAccount(socket)
        await sendMessages(socket)
    })
}