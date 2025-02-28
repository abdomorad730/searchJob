import mongoose from "mongoose"

const companySchema = new mongoose.Schema({
    companyName: {
        type: String,
        required: true,
        lowercase: true,
        unique: true,
        maxLength: 50,
        minLenghth: 3
    },
    describtion: {
        type: String,
        required: true

    },
    industry: {
        type: String,
        required: true

    },
    address: {
        type: String,
        required: true

    },
    companyEmail: {
        lowercase: true,
        type: String,
        required: true,
        unique: true,
    },

    numberOfEmployees: {
        type: Number,
        required: true

    },

    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    approvedByAdmin: {
        type: Boolean,
        default: false
    },

    deletedAt: Date,
    bannedAt: Date,
    imageCover: {
        secure_url: String,
        public_id: String
    },
    logo: {
        secure_url: String,
        public_id: String
    },
    HRs:[{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
    }],
    legalAttachment:{
        secure_url: String,
        public_id: String
    }
},
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
        timestamps: true
    })
const companyModel = mongoose.models.Company || mongoose.model('Company', companySchema)

export default companyModel