import jwt from 'jsonwebtoken'

export const generate = async (payload={},signature=process.env.SECRET_KEY_USER,options={})=>{
    return jwt.sign(payload,signature,options)
}