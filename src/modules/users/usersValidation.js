import Joi from "joi";
import { generalRules } from "../../utils/index.js";

export const sign_upSchema = {
    body: Joi.object({
        firstName: Joi.string().min(3),
        lastName: Joi.string().min(3),
        password: Joi.string().pattern(/^^(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/),
        cpassword: Joi.string().valid(Joi.ref('password')),
        email: Joi.string().pattern(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/),
        gender: Joi.string().valid("male", "female"),
        phone: Joi.string().pattern(/^(\+201|01)[0-2,5]{1}[0-9]{8}/),
        DOB: generalRules.Date.required()
    }).options({ presence: 'required' }),
    file: Joi.object().required()
}
export const confirmSchema = {
    body: Joi.object({
        email: Joi.string().pattern(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/).required(),
        code: Joi.string().length(4).required()
    })
}
export const sign_inSchema = {
    body: Joi.object({
        email: Joi.string().pattern(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/).required(),
        password: Joi.string().pattern(/^^(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/),

    })
}
export const refreshTokenSchema = {
    body: Joi.object({
        authorization: Joi.string()
    }).options({ presence: 'required' })
}

export const signUpGmailSchema = {
    body: Joi.object({
        idToken: Joi.string()
    }).options({ presence: 'required' })
}
export const signInGmailSchema = {
    body: Joi.object({
        email: Joi.string().pattern(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/).required(),
    }).options({ presence: 'required' })
}
export const forgetPasswordSchema = {
    body: Joi.object({
        email: Joi.string().pattern(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/),
    }).options({ presence: 'required' })

}

export const resetPasswordSchema = {
    body: Joi.object({
        email: Joi.string().pattern(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/),
        code: Joi.string().length(4),
        password: Joi.string().pattern(/^^(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/),
        cpassword: Joi.string().valid(Joi.ref('password')),
    }).options({ presence: 'required' })
}
export const updateProfileSchema = {
    body: Joi.object({
        firstName: Joi.string().min(3),
        firstName: Joi.string().min(3),
        DOB: generalRules.Date,
        gender: Joi.string().valid("male", "female"),
        phone: Joi.string().pattern(/^(\+201|01)[0-2,5]{1}[0-9]{8}/)
    }),
    file: Joi.object()
}
export const UpdatePasswordSchema = {
    body: Joi.object({
        oldPassword: Joi.string().pattern(/^^(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/),
        password: Joi.string().pattern(/^^(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/),
        cpassword: Joi.string().valid(Joi.ref('password')),
    }).options({ presence: 'required' })
}
export const paramsSchema = {
    params: Joi.object({
        id: generalRules.id,
    }).options({ presence: 'required' })
}
