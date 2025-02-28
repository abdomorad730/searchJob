import Joi from "joi";
import { customValid, generalRules } from "../../utils/index.js";

export const AppSchema = {
    params: Joi.object({
        jobId:Joi.string().custom(customValid),
    }).options({ presence: 'required' }),
    file: Joi.object().required()
    
}