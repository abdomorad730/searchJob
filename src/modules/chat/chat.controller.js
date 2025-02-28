import { Router } from "express";
import { authentecation } from "../../middleware/auth.js";
import { getChat } from "./services/chat.service.js";

const chatRouter=Router()
chatRouter.get('/:id',authentecation,getChat)
export default chatRouter