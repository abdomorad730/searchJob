import { Router } from "express";
import { validation } from "../../middleware/validation.js";
import { confirmSchema, forgetPasswordSchema, paramsSchema, refreshTokenSchema, resetPasswordSchema, sign_inSchema, sign_upSchema, signInGmailSchema, signUpGmailSchema, UpdatePasswordSchema, updateProfileSchema } from "./usersValidation.js";
import { addFriend, ban_or_unban, confirmMail,  deleteImageCover,  deleteProfilePic,  forgetPassword,  freeze,  getProfile,  getUserLogin,  refreshToken, resetPassword, shareProfile, sign_in, sign_in_Gmail, sign_up, sign_up_Gmail, updatePassword, updateProfile, uploadImageCover, uploadProfilePic } from "./users.services.js";
import { multerHost } from "../../middleware/multer.js";
import { roles, types } from "../../services/object.js";
import { authentecation, authorization } from "../../middleware/auth.js";

const userRouter=Router()

userRouter.post('/',multerHost(types.image).single('attachment'),validation(sign_upSchema),sign_up)
userRouter.patch('/confirm',validation(confirmSchema),confirmMail)
userRouter.post('/login',validation(sign_inSchema),sign_in)
userRouter.get('/refreshToken',validation(refreshTokenSchema),refreshToken)
userRouter.post('/sign_up_Gmail',validation(signUpGmailSchema),sign_up_Gmail)
userRouter.post('/sign_in_Gmail',validation(signInGmailSchema),sign_in_Gmail)
userRouter.patch('/forgetPassword',validation(forgetPasswordSchema),forgetPassword)
userRouter.patch('/resetPassword',validation(resetPasswordSchema),resetPassword)
userRouter.patch('/updatePassword',validation(UpdatePasswordSchema),authentecation,updatePassword)
userRouter.patch('/updateProfile',multerHost(types.image).single("attachment"),authentecation,validation(updateProfileSchema),updateProfile)
userRouter.get('/profile',authentecation,getProfile)
userRouter.get('/getUserLogin',authentecation,getUserLogin)

userRouter.get('/shareProfile/:id',validation(paramsSchema),authentecation,shareProfile)
userRouter.patch('/uploadPorfilePic',multerHost(types.image).single("attachment"),authentecation,uploadProfilePic)
userRouter.patch('/uploadImageCover',multerHost(types.image).single("attachment"),authentecation,uploadImageCover)
userRouter.patch('/deleteImageCover',authentecation,deleteImageCover)
userRouter.patch('/deleteProfilePic',authentecation,deleteProfilePic)
userRouter.delete('/freeze',authentecation,freeze)
userRouter.patch('/:id',authentecation,authorization([roles.admin]),validation(paramsSchema),ban_or_unban)
userRouter.patch("/add/:userId",authentecation,addFriend)
















export default userRouter