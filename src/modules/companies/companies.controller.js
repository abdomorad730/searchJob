import { Router } from "express";
import { addCompany, approve_company, ban_or_unban, deleteImageCover, deleteLogo, freeze, getSpecificCompany, searchCompanywithName, updateCompany, uploadImageCover, uploadLogo } from "./companies.services.js";
import { authentecation, authorization } from "../../middleware/auth.js";
import { validation } from "../../middleware/validation.js";
import { addCompanySchema, companyWithNameSchema, deleteSchema, getSpecificCompanySchema, updateCompanySchema, uploadSchema } from "./companiesValidation.js";
import { multerHost } from "../../middleware/multer.js";
import { roles, types } from "../../services/object.js";
import { paramsSchema } from "../users/usersValidation.js";

const companyRouter=Router()
companyRouter.post('/',multerHost([...types.image,...types.pdf]).single("attachment"),authentecation,validation(addCompanySchema),addCompany)
companyRouter.get('/:_id',authentecation,validation(getSpecificCompanySchema),getSpecificCompany)
companyRouter.get('/',authentecation,validation(companyWithNameSchema),searchCompanywithName)
companyRouter.patch('/uploadLogo/:id',multerHost(types.image).single("attachment"),authentecation,validation(uploadSchema),uploadLogo)
companyRouter.patch('/uploadImageCover/:id',multerHost(types.image).single("attachment"),authentecation,validation(uploadSchema),uploadImageCover)
companyRouter.delete('/deleteLogo/:id',authentecation,validation(deleteSchema),deleteLogo)
companyRouter.delete('/deleteImageCover/:id',authentecation,validation(deleteSchema),deleteImageCover)
companyRouter.delete('/:id',authentecation,validation(deleteSchema),freeze)
companyRouter.patch('/updateCompany/:id',authentecation,validation(updateCompanySchema),updateCompany)
companyRouter.patch('/admin/:id',authentecation,authorization([roles.admin]),validation(paramsSchema),ban_or_unban)
companyRouter.patch('/aprove/:id',authentecation,authorization([roles.admin]),validation(paramsSchema),approve_company)



export default companyRouter
