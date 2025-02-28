import appModel from "../../DB/models/applicationModel.js"
import cloudinary from "../../utils/cloudnairy/index.js"
import { asyncHandler } from "../../utils/index.js"

export const addApps = asyncHandler(async (req, res, next) => {

    const {jobId}=req.params
    if (!req.file) {
        return next(new Error('please enter img'))
        }

        const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, { folder: 'searshJob/cv' })
        req.body.logo = { secure_url, public_id }
    const app = await appModel.create({jobId:jobId,userId:req.user._id,userCV:{ secure_url, public_id }})
     return res.status(200).json({ msg: "done", app  })
 
 
 })