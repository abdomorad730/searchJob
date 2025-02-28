import jwt from 'jsonwebtoken'
export const verify = async (token,signature=process.env.SECRET_KEY_USER)=>{
    return jwt.verify(token,signature )
}
