import { decodeToken } from "../services/decodeToken.js"
import { tokenTypes } from "../services/object.js"
import { asyncHandler } from "../utils/index.js"

export const authentecation = asyncHandler(async (req, res, next) => {
    
    const { authorization } = req.headers
    const user = await decodeToken(authorization,tokenTypes.access,next)
    req.user = user
    next()

})

export const authorization =(roles=[])=>{
    return async (req,res,next)=>{
        if(!roles.includes(req?.user.role)){
            return next(new Error('access denied',{cause:403}))
        }
        next()
    }
}