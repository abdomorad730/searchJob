import Joi from "joi";
import { customValid, generalRules } from "../../utils/index.js";

export const paSchema = {
    params: Joi.object({
        jobId:Joi.string().custom(customValid),
        companyName:Joi.string().min(3).required()
    })
}
