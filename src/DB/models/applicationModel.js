import mongoose from "mongoose";
import { status } from "../../services/object.js";

const applicationSchema = new mongoose.Schema({
    jobId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job'
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    userCV: {
        secure_url: String,
        public_id: String
    },
    status: {
        type: String,
        enum: Object.values(status),
        default:status.pending
    }
},{timestamps:true})

const appModel = mongoose.models.App || mongoose.model('App', applicationSchema)

export default appModel