import chatModel from "../../../DB/models/chatModel.js"
import { decodeTokenSocket } from "../../../services/decodeToken.js"
import { connectionUser } from "./chat.socket.service.js"

export const sendMessages = async (socket) => {
    socket.on('sendMessage', async (data) => {
        const { message, destId } = data
        const data1 = await decodeTokenSocket(socket)
        if (data1.statusCode != 200) {
            return socketocket.emit('authError', data1)
        }
        const userId = data1.user._id
        const chat = await chatModel.findOneAndUpdate({
            $or: [
                { senderId: userId, receiverId: destId },
                { receiverId: userId, senderId: destId },
            ]
        }, {
            $push: { messages: { sender: userId, message } }
        },{
            new: true
        })
        if (!chat) {
 

            await chatModel.create({ senderId: userId, receiverId: destId, messages: [{ sender: userId, message }] })
        }
        socket.emit('successMessage', { message })
        socket.to(connectionUser.get(destId.toString())).emit('recieveMessage', { message, chat })
    })

}