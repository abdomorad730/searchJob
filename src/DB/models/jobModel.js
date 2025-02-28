
import mongoose from "mongoose"
import { jobLoc, Level_of_seniority, timeWorking } from "../../services/object.js"

const jobSchema = new mongoose.Schema({
    jobTitle: {
        type: String,
        required: true,
    },

 
    jobDescribtion: {
        type: String,
        required: true,
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    addedBy: {
        type: mongoose.Schema.Types.ObjectId,
        required:true,
        ref: 'User'
    },
    closed: {
        type: Boolean,
        default: false
    },
    companyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company'
    },
    jobLocation: {
        type: String,
        enum: Object.values(jobLoc),
        required: true,
    },
    workingTime: {
        type: String,
        enum: Object.values(timeWorking),
        required: true,
    },
    seniorityLevel: {
        type: String,
        enum: Object.values(Level_of_seniority),
        required: true,
    },
    technicalSkills: [String],
    softSkills: [String],



},{   toJSON:{virtuals:true}
,toObject:{virtuals:true}
, timestamps: true})
jobSchema.virtual('app',{
    ref:'App',
    localField: "_id",
    foreignField:"jobId"

})
const jobModel = mongoose.models.Job || mongoose.model('Job', jobSchema)

export default jobModel