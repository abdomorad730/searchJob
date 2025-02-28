import { isValidObjectId } from "mongoose";
import chatModel from "../../../DB/models/chatModel.js";
import { asyncHandler } from "../../../utils/index.js";

export const getChat = asyncHandler(async (req, res, next) => {
    const { id } = req.params
    console.log(req.user._id);
    
    const chat = await chatModel.findOne({
        $or: [
            { senderId: req.user._id, receiverId: id },
            { receiverId: req.user._id, senderId: id },
        ]
    }).populate([
        { path: 'receiverId' },
        { path: 'senderId' },

        { path: 'messages.sender' }
    ])
    return res.status(200).json({msg:'done',chat})
})