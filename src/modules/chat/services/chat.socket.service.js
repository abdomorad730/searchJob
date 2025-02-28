import { decodeTokenSocket } from "../../../services/decodeToken.js";
export const connectionUser=new Map()

export const registerAccount=async(socket)=>{
    const data =await decodeTokenSocket(socket)
    if(data.statusCode!=200){
        return socket.emit('authError',data)
    }
    
    connectionUser.set(data.user._id.toString(),socket.id)

    return 'done'
}
export const logOutAccount=async(socket)=>{
   return socket.on('disconnect',async()=>{
    const data =await decodeTokenSocket(socket)
    if(data.statusCode!=200){
        return socketocket.emit('authError',data)
    }    
    connectionUser.delete(data.user._id.toString(),socket.id)
    return 'done'
   }) 
}


