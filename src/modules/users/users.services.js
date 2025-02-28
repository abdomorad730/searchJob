import { OAuth2Client } from "google-auth-library"
import userModel from "../../DB/models/userModel.js"
import { decodeToken } from "../../services/decodeToken.js"
import { provider, roles, tokenTypes } from "../../services/object.js"
import cloudinary from "../../utils/cloudnairy/index.js"
import { asyncHandler, compare, decrypt, generate, hash } from "../../utils/index.js"
import { eventEmitter } from "../../utils/sendMail/sendMail.js"


/*---------------------------Sign_Up---------------------*/

export const sign_up = asyncHandler(async (req, res, next) => {
    const { email, firstName, lastName, password, phone, cpassword, gender, DOB } = req.body

    const emailExist = await userModel.findOne({ email })
    if (emailExist) {
        return next(new Error("email already exist"))
    }
    if (!req.file) {
        return next(new Error('please add image'))
    }
    const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, {
        folder: 'searchJob/userProfile',
    })
    const hashText = await hash(password, process.env.SALT_ROUNDES)
    const user = await userModel.create({ email, firstName, lastName, password: hashText, mobileNumber: phone, gender, profilePic: { secure_url, public_id }, DOB })
    eventEmitter.emit('sendMail', { email })

    res.status(200).json({ msg: "done", user })
})

/*------------------------CONFIRMEMAIL-------------------*/

export const confirmMail = asyncHandler(async (req, res, next) => {
    const { code, email } = req.body
    const user = await userModel.findOne({ email })
    if (!user) {
        return next(new Error('email not exist', { cause: 404 }))
    }
    const oldCode = user.otp.find(ele => ele.type == 'confirmEmail' && ele.expireIn.getTime() > Date.now())

    if (!oldCode) {
        return next(new Error('expired code'))
    }
    const checkCode = await compare(code, oldCode.code)
    if (!checkCode) {
        return next(new Error('code not match'))
    }
    await userModel.updateOne({ email }, { confirmed: true, $unset: { otp: 0 } })
    return res.status(200).json({ msg: 'done', user })
})

/*--------------------SIGN_IN------------------------*/
export const sign_in = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body
    const user = await userModel.findOne({ email, confirmed: true, provider: provider.system })
    if (!user) {
        return next(new Error('user not found', { cause: 404 }))
    }
    const hashText = await compare(password, user.password)
    if (!hashText) {
        return next(new Error('invalid password', { cause: 400 }))
    }
    const access_token = await generate({ id: user._id }, user.role == roles.user ? process.env.SECRET_KEY_USER : process.env.SECRET_KEY_ADMIN, { expiresIn:'4h', algorithm: 'HS384' })
    const refresh_token = await generate({ id: user._id }, user.role == roles.user ? process.env.REFRESH_KEY_USER : process.env.REFRESH_KEY_ADMIN, { expiresIn: '1w', algorithm: 'HS384' })
    return res.status(200).json({
        msg: 'done', token: {
            access_token,
            refresh_token
        }
    })
})

/*---------------------refreshToken----------*/
export const refreshToken = asyncHandler(async (req, res, next) => {
    const { authorization } = req.body
    const user = await decodeToken(authorization, tokenTypes.refresh, next)
    const access_token = await generate({ id: user._id }, user.role == roles.user ? process.env.SECRET_KEY_USER : process.env.SECRET_KEY_ADMIN, { expiresIn: '1d', algorithm: 'HS384' })
    return res.status(200).json({ msg: 'done', token: { access_token } })
})

/*----------------------SIGN_UP WITH GMAIL---------*/
export const sign_up_Gmail = asyncHandler(async (req, res, next) => {
    const { idToken } = req.body
    const client = new OAuth2Client();
    async function verify() {
        const ticket = await client.verifyIdToken({
            idToken,
            audience: process.env.WEB_CLIENT_ID,
        });
        const payload = ticket.getPayload();

        return payload
    }
    const awaitt = await verify()
    console.log(awaitt)
    const { email_verified, email, given_name, family_name, picture, } = await verify()
    let user = await userModel.findOne({ email })

    if (!user) {
        user = await userModel.create({
            email,
            confirmed: email_verified,
            profilePic: picture,
            firstName: given_name,
            lastName: family_name,
            provider: provider.google,
        })
    } else {
        return next(new Error('user already exist'))

    }
    return res.status(200).json({
        msg: 'done', user
    })
})

/*------------------------sign_in_Gmail-----------*/

export const sign_in_Gmail = asyncHandler(async (req, res, next) => {
    const { idToken } = req.body
    const client = new OAuth2Client();
    async function verify() {
        const ticket = await client.verifyIdToken({
            idToken,
            audience: process.env.WEB_CLIENT_ID,
        });
        const payload = ticket.getPayload();

        return payload
    }
    const awaitt = await verify()
    console.log(awaitt)
    const {email} = await verify()
    let user = await userModel.findOne({ email ,provider:provider.google})

    if (!user) {
        return next(new Error('user not found'))
    } 
    const access_token = await generate({ id: user._id }, user.role == 'user' ? process.env.SECRET_KEY_USER : process.env.SECRET_KEY_ADMIN, { expiresIn: '1d', algorithm: 'HS384' })
    return res.status(200).json({
        msg: 'done', access_token
    })
})

/*----------------forget password -----------------*/
export const forgetPassword = asyncHandler(async (req, res, next) => {
    const { email } = req.body
    const user = await userModel.findOne({ email, confirmed: true, isDeleted: false })
    if (!user) {
        return next(new Error('user not found', { cause: 404 }))
    }
    eventEmitter.emit('forgetPassword', { email })


    return res.status(200).json({ msg: 'done' })
})

/*---------------reset password-------------------*/
export const resetPassword = asyncHandler(async (req, res, next) => {
    const { code, email, password, cpassword } = req.body
    const user = await userModel.findOne({ email, confirmed: true, isDeleted: false })
    if (!user) {
        return next(new Error('email not exist', { cause: 404 }))
    }
    const oldCode = user.otp.find(ele => ele.type == 'confirmPassword' && ele.expireIn.getTime() > Date.now())

    if (!oldCode) {
        return next(new Error('expired code'))
    }

    const checkCode = await compare(code, oldCode.code)
    if (!checkCode) {
        return next(new Error('code not match'))
    }
    const hashText = await hash(password, process.env.SALT_ROUNDS)

    await userModel.updateOne({ email }, { password: hashText, confirmed: true, $unset: { otp: 0 } })
    return res.status(200).json({ msg: 'done', user })
})
/*--------------------updatePassword---------------------*/
export const updatePassword = asyncHandler(async (req, res, next) => {
    const { oldPassword, password, cpassword } = req.body
    const checkPassword = await compare(oldPassword, req.user.password)
    if (!checkPassword) {
        return next(new Error('invalid oldPassword'))
    }
    const pass = await hash(password, process.env.SALT_ROUNDS)
    const user = await userModel.findByIdAndUpdate({ _id: req.user._id }, { password: pass, changedCredentialAt: Date.now() })
    return res.status(200).json({ msg: 'done', user })
})
/*--------------------updateProfile---------------------*/

export const updateProfile = asyncHandler(async (req, res, next) => {
    if (req.body.mobileNumber) {
        req.body.mobileNumber = await encrypt(req.body.mobileNumber, process.env.SECRET_KEY_ADMIN)
    }
    if (req.file) {
        await cloudinary.uploader.destroy(req.user.imageCover.public_id)
        const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, { folder: 'searshJob/userProfile' })
        req.body.imageCover = { secure_url, public_id }
    }
    const user = await userModel.findByIdAndUpdate({ _id: req.user._id }, req.body, { new: true })
    return res.status(200).json({ msg: 'done', user })
})
/*---------------------getUserLogin-------------------*/
export const getUserLogin = asyncHandler(async (req, res, next) => {
    let user = await userModel.findOne({ _id: req.user._id })
    user.mobileNumber = await decrypt(user.mobileNumber, process.env.SECRET_KEY_ADMIN)

    return res.status(200).json({ msg: 'done', user })
})

/*---------------------getProfile-------------------*/
export const shareProfile = asyncHandler(async (req, res, next) => {
    const { id } = req.params
    const user = await userModel.findOne({ _id: id, isDeleted: false }).select('lastName userName firstName mobileNumber imageCover profilePic friends -_id').populate([{path:'friends'}])
    if (!user) {
        return next(new Error('user not found or user is deleted'))
    }
    user.mobileNumber = await decrypt(user.mobileNumber, process.env.SECRET_KEY_ADMIN)


    return res.status(200).json({ msg: 'done', user })
})
export const getProfile = asyncHandler(async (req, res, next) => {
    const user = await userModel.findOne({ _id: req.user._id, isDeleted: false }).populate([{path:'friends'}])
    if (!user) {
        return next(new Error('user not found or user is deleted'))
    }
    user.mobileNumber = await decrypt(user.mobileNumber, process.env.SECRET_KEY_ADMIN)


    return res.status(200).json({ msg: 'done', user })
})
/*---------------------upload profile picture--------------*/
export const uploadProfilePic = asyncHandler(async (req, res, next) => {

    if (!req.file) {

        return next(new Error('please add img'))
    }
    if(req.user.profilePic.public_id){
        await cloudinary.uploader.destroy(req.user.profilePic.public_id)
    }
    const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, { folder: 'searshJob/userProfile' })
    req.body.profilePic = { secure_url, public_id }
    const user = await userModel.findByIdAndUpdate({ _id: req.user._id }, req.body, { new: true })
    return res.status(200).json({ msg: 'done', user })
})
/*----------------------upload cover picture-------------*/
export const uploadImageCover = asyncHandler(async (req, res, next) => {
    if (!req.file) {

        return next(new Error('please add img'))
    }
    if(req.user.imageCover.public_id){
        await cloudinary.uploader.destroy(req.user.imageCover.public_id)
    }
    const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, { folder: 'searshJob/userProfile' })
    req.body.imageCover = { secure_url, public_id }

    const user = await userModel.findByIdAndUpdate({ _id: req.user._id }, req.body, { new: true })
    return res.status(200).json({ msg: 'done', user })
})
/*----------------------DELETE COVER PICTURE-------------*/
export const deleteImageCover = asyncHandler(async (req, res, next) => {
 
    if(req.user.imageCover.public_id){
        await cloudinary.uploader.destroy(req.user.imageCover.public_id)
    }

    const user = await userModel.findByIdAndUpdate({ _id: req.user._id } ,{$unset:{imageCover:0}},{new:true})
    return res.status(200).json({ msg: 'done', user })
})
/*----------------------DELETE PROFILE PICTURE-------------*/
export const deleteProfilePic = asyncHandler(async (req, res, next) => {
 
    if(req.user.profilePic.public_id){
        await cloudinary.uploader.destroy(req.user.profilePic.public_id)
    }

    const user = await userModel.findByIdAndUpdate({ _id: req.user._id } ,{$unset:{profilePic:0}},{new:true})
    return res.status(200).json({ msg: 'done', user })
})
/*---------------------SOFT DELETE-----------------*/
export const freeze = asyncHandler(async(req,res,next)=>{
    const user =await userModel.findByIdAndUpdate(req.user._id,{isDeleted:true,deletedAt:Date.now()},{new:true})
    return res.status(200).json({ msg: "done", user })
})
/*---------------------------------------------------------ADMIN----------------------------------------------------------------------------*/

export const ban_or_unban=asyncHandler(async(req,res,next)=>{
    const {id}=req.params
    const user=await userModel.findById({_id:id})
    if(!user){
        return next(new Error('user not found'))
    }
    let newUser=''
    if(user.bannedAt){
        newUser= await userModel.findByIdAndUpdate({_id:id},{$unset:{bannedAt:0}},{new:true})
    }else{
        newUser= await userModel.findByIdAndUpdate({_id:id},{bannedAt:Date.now()},{new:true})

    }
    return res.status(200).json({msg:'done',newUser})
})
export const addFriend=asyncHandler(async(req,res,next)=>{
    const {userId}=req.params
    const user1=await userModel.findByIdAndUpdate({_id:userId},{$addToSet:{friends:req.user._id}},{new:true})
    if(!user1){
        return next(new Error('user not found'))
    }
    const user=await userModel.findByIdAndUpdate({_id:req.user._id},{$addToSet:{friends:userId}},{new:true})

    return res.status(200).json({msg:'done',user})
})
