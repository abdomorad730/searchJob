import Joi from "joi";
import { generalRules } from "../../utils/index.js";

export const addCompanySchema = {
    body: Joi.object({
        companyName: Joi.string().min(3),
        describtion: Joi.string().min(3),
        industry: Joi.string(),
        address: Joi.string().min(3),
        numberOfEmployees:generalRules.value,
        companyEmail: Joi.string().pattern(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/),
    }).options({ presence: 'required' }),
    file: Joi.object().required(),
}
export const getSpecificCompanySchema = {
    params: Joi.object({
        _id: generalRules.id,
    }).options({ presence: 'required' })

}
export const companyWithNameSchema = {
    body: Joi.object({
        companyName: Joi.string().min(3),
    }).options({ presence: 'required' })

}
export const uploadSchema = {
    params: Joi.object({
        id: generalRules.id,
    }).options({ presence: 'required' }),
    file: Joi.object().required()
}
export const deleteSchema = {
    params: Joi.object({
        id: generalRules.id,
    }).options({ presence: 'required' }),
}
export const updateCompanySchema = {
    body: Joi.object({
        companyName: Joi.string().min(3),
        describtion: Joi.string().min(3),
        industry: Joi.string(),
        address: Joi.string().min(3),
        numberOfEmployees:generalRules.value,
        companyEmail: Joi.string().pattern(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/),
    }),
}