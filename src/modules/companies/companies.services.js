import companyModel from "../../DB/models/companyModel.js";
import cloudinary from "../../utils/cloudnairy/index.js";
import { asyncHandler } from "../../utils/index.js";

export const addCompany = asyncHandler(async(req, res, next) => {
    const { companyName, describtion, industry, address, companyEmail, numberOfEmployees } = req.body
    console.log(    req.body    );
    
    const emailExist = await companyModel.findOne({ companyEmail })
    if (emailExist) {
        return next(new Error("email already exist"))
    }
    if (await companyModel.findOne({ companyName })) {
        return next(new Error("companyName already used"))
    }
   if (!req.file) {
        return next(new Error('please add image'))
    }
    const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, {
        folder: 'searchJob/legalAttachment',
    })
    const Company = await companyModel.create({ companyName, createdBy: req.user._id,legalAttachment: { secure_url, public_id },describtion, industry, address, companyEmail, numberOfEmployees })
    return res.status(200).json({ msg: "done", Company })

})
/*--------------------searchCompanywithName-----------------*/
export const searchCompanywithName = asyncHandler(async (req, res, next) => {
    const { companyName } = req.body
    const company = await companyModel.findOne({ companyName })
    return res.status(200).json({ msg: 'done', company })
})
/*-------------------- get Specific Company-----------------*/

export const getSpecificCompany= asyncHandler(async (req, res, next) => {
    const { _id } = req.params
    const company = await companyModel.findOne({ _id })
    return res.status(200).json({ msg: 'done', company })
})
/*---------------------upload profile picture--------------*/
export const uploadLogo = asyncHandler(async (req, res, next) => {
    const { id } = req.params
    const company = await companyModel.findOne({ _id: id,createdBy:req.user._id,deletedAt: { $exists: false },bannedAt: { $exists: false } })
    if (!req.file) {
        return next(new Error('please add img'))
    }
    if (!company) {
        return next(new Error('company not Found'))
    }
    if (company.logo.public_id) {
        await cloudinary.uploader.destroy(company.logo.public_id)
    }
    const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, { folder: 'searshJob/companylogo' })
    req.body.logo = { secure_url, public_id }
    const Company = await companyModel.findByIdAndUpdate({ _id: id }, req.body, { new: true })
    return res.status(200).json({ msg: 'done', Company })
})
/*----------------------upload cover picture-------------*/
export const uploadImageCover = asyncHandler(async (req, res, next) => {
    const { id } = req.params
    const company = await companyModel.findOne({ _id: id,createdBy:req.user._id ,deletedAt: { $exists: false },bannedAt: { $exists: false }})
    if (!req.file) {
        return next(new Error('please add img'))
    }
    if (!company) {
        return next(new Error('company not Found'))
    }
    if (company.imageCover.public_id) {
        await cloudinary.uploader.destroy(company.imageCover.public_id)
    }
    const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, { folder: 'searshJob/companyImageCover' })
    req.body.imageCover = { secure_url, public_id }
    const Company = await companyModel.findByIdAndUpdate({ _id: id }, req.body, { new: true })
    return res.status(200).json({ msg: 'done', Company })
})
/*----------------------DELETE COVER PICTURE-------------*/
export const deleteImageCover = asyncHandler(async (req, res, next) => {
    
    const { id } = req.params
    const company = await companyModel.findOne({ _id: id ,createdBy:req.user._id,deletedAt: { $exists: false },bannedAt: { $exists: false }})
    if (!company) {
        return next(new Error('company not Found'))
    }
    if (company.imageCover.public_id) {
        await cloudinary.uploader.destroy(company.imageCover.public_id)
    }
    const Company = await companyModel.findByIdAndUpdate({ _id: id }, { $unset: { imageCover: 0 } }, { new: true })
    return res.status(200).json({ msg: 'done', Company })
})
/*----------------------DELETE LOGO-------------*/
export const deleteLogo = asyncHandler(async (req, res, next) => {
    const { id } = req.params
    const company = await companyModel.findOne({ _id: id ,createdBy:req.user._id,deletedAt: { $exists: false },bannedAt: { $exists: false }})
    if (!company) {
        return next(new Error('company not Found'))
    }
    if (company.logo.public_id) {
        await cloudinary.uploader.destroy(company.logo.public_id)
    }
    const Company = await companyModel.findByIdAndUpdate({ _id: id }, { $unset: { logo: 0 } }, { new: true })
    return res.status(200).json({ msg: 'done', Company })
})
/*---------------------------freeze company----------------*/
export const freeze = asyncHandler(async (req, res, next) => {
    const { id } = req.params
    const condition = req.user.role == 'admin' ? {} : { createdBy: req.user._id }
    const company = await companyModel.findOneAndUpdate({ _id:id, ...condition,  deletedAt: { $exists: false }}, { deletedAt: Date.now() }, { new: true })
    return res.status(200).json({ msg: "done", company })
})
/*---------------------update company-----------------------*/
export const updateCompany = asyncHandler(async (req, res, next) => {
    const { _id } = req.params
    if(req.body.legalAttachment){
        return next (new Error('cannot update in legalAttachment'))
    }
    const company = await companyModel.findOneAndUpdate({ _id,createdBy: req.user._id, deletedAt: { $exists: false } },req.body , { new: true })
    return res.status(200).json({ msg: "done", company })
})
export const ban_or_unban=asyncHandler(async(req,res,next)=>{
    const {id}=req.params
    const company=await companyModel.findById({_id:id})
    if(!company){
        return next(new Error('company not found'))
    }
    let newCompany=''
    if(user.bannedAt){
        newCompany= await companyModel.findByIdAndUpdate({_id:id},{$unset:{bannedAt:0}},{new:true})
    }else{
        newCompany= await companyModel.findByIdAndUpdate({_id:id},{bannedAt:Date.now()},{new:true})

    }
    return res.status(200).json({msg:'done',newCompany})
})
export const approve_company=asyncHandler(async(req,res,next)=>{
    const {id}=req.params
    const user=await companyModel.findById({_id:id})
    if(!user){
        return next(new Error('user not found'))
    }
    let newCompany=await companyModel.findByIdAndUpdate({_id:id},{approvedByAdmin:true},{new:true})
   
    return res.status(200).json({msg:'done',newCompany})
})