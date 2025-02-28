import appModel from "../../DB/models/applicationModel.js";
import companyModel from "../../DB/models/companyModel.js";
import jobModel from "../../DB/models/jobModel.js";
import { asyncHandler } from "../../utils/index.js";

export const addJob = asyncHandler(async (req, res, next) => {
    const { softSkills, technicalSkills, seniorityLevel, workingTime, jobLocation, jobDescribtion, jobTitle, companyId } = req.body
    const company=await companyModel.findOne({ _id: companyId})
    if (!((company&&company.createdBy==req.user._id) || (company&& company.HRs.includes(req.user._id)))) {
        return next(new Error("cannot do this operation"))
    }

    const job = await jobModel.create({ softSkills, technicalSkills, addedBy: req.user._id, seniorityLevel, workingTime, jobLocation, jobDescribtion, jobTitle, companyId })
    return res.status(200).json({ msg: "done", job })

})

export const updateJob = asyncHandler(async (req, res, next) => {
    const { id } = req.params
    const job = await jobModel.findOne({ _id: id })
    if (!job) {
        return next(new Error("job not found"))
    }
    if (!await companyModel.findOne({ _id: job.companyId, addedBy: req.user._id })) {
        return next(new Error("cannot do this operation"))
    }
    const newJob= await jobModel.findByIdAndUpdate({_id:id},{...req.body,updatedBy:req.user._id},{new:true})
    return res.status(200).json({ msg: "done", job:newJob })

})
export const deleteJob = asyncHandler(async (req, res, next) => {
    const { id } = req.params
    const job = await jobModel.findOne({ _id: id })
    if (!job) {
        return next(new Error("job not found"))
    }
    const company =await companyModel.findOne({ _id: job.companyId })
    if (!(company&& company.HRs.includes(req.user._id))) {
        return next(new Error("cannot do this operation"))
    }
    const newJob= await jobModel.findByIdAndDelete({_id:id})
    return res.status(200).json({ msg: "done", job:newJob })

})

export const getAllJobOrOne = asyncHandler(async (req, res, next) => {
    const { companyName,jobId} = req.params
    const {page}=req.query
    const limit=2
    const skip=(page*2)-2
    const company =await companyModel.findOne({companyName})
    let jobs=[]
     jobs=await jobModel.find({companyId:company._id}).limit(limit).skip(skip)
    if((jobId)){
        for (const element of jobs) {
            if(element._id==jobId){
                jobs=element
            }
        }
    }
    return res.status(200).json({ msg: "done", jobs  })
})

export const getJobwithFilter = asyncHandler(async (req, res, next) => {
    const {page}=req.params
    const limit=2
    const skip=(page*2)-2
    const jobs=await jobModel.find(req.query).limit(limit).skip(skip)
    return res.status(200).json({ msg: "done", jobs  })


})
export const addApps = asyncHandler(async (req, res, next) => {

   const {jobId}=req.params
   const app = await appModel.create({jobId:jobId,userId:req.user._id})
    return res.status(200).json({ msg: "done", app  })


})

export const getApps = asyncHandler(async (req, res, next) => {
    const {jobId}=req.params
    const {page}=req.query
    const limit=2
    const skip=(page*2)-2
   /* const company=await companyModel.findOne({ _id: companyId})
    if (!((company&&company.createdBy==req.user._id) || (company&& company.HRs.includes(req.user._id)))) {
        return next(new Error("cannot do this operation"))
    }*/
    const jobs=await jobModel.findOne({_id:jobId}).populate([{path:'app',populate:{path:"userId"},limit:limit,skip:skip,}]).select('app companyId')
       const company=await companyModel.findOne({ _id:jobs.companyId})
    if (!((company&&company.createdBy==req.user._id) || (company&& company.HRs.includes(req.user._id)))) {
        return next(new Error("cannot do this operation"))
    }
    return res.status(200).json({ msg: "done", jobs  })


})
