import { Router } from "express";
import { addApps } from "./apps.service.js";
import { roles, types } from "../../services/object.js";
import { multerHost } from "../../middleware/multer.js";
import { validation } from "../../middleware/validation.js";
import { AppSchema } from "./appValidation.js";
import { authentecation, authorization } from "../../middleware/auth.js";

const appRouter=Router()
appRouter.post('/:jobId',multerHost(types.pdf).single('attachment'),authentecation,authorization([roles.user]),validation(AppSchema),addApps)

export default appRouter