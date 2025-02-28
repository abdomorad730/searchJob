import mongoose from "mongoose";
import { gender, provider, roles } from "../../services/object.js";
import {encrypt } from "../../utils/index.js";

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        lowercase: true,
        maxLength: 50,
        minLenghth: 3
    },
    lastName: {
        type: String,
        required: true,
        lowercase: true,
        maxLength: 50,
        minLenghth: 3
    },
    DOB: {
        type: String,
        required: function () {
            return this.provider == provider.system ? true : false
        },
        validate: {
            validator: function (v) {
                return /^\d{4}[\-\-](0?[1-9]|1[012])[\-\-](0?[1-9]|[12][0-9]|3[01])$/.test(v);
            },
        }
    },
    email: {
        lowercase: true,
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: function () {
            return this.provider == provider.system ? true : false
        },
        minLenghth: 8
    },
    mobileNumber: {
        type: String,
        default: "no"
    },
    gender: {
        type: String,
        enum: Object.values(gender),
        default: gender.male,
        lowercase: true

    },
    role: {
        type: String,
        enum: Object.values(roles),
        default: 'user',
        lowercase: true
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    confirmed: {
        type: Boolean,
        default: false
    },
    changedCredentialAt: Date,
    isDeleted: {
        type: Boolean,
        default: false
    },
    deletedAt: Date,
    bannedAt: Date,
    imageCover: {
        secure_url: String,
        public_id: String
    },
    profilePic: {
        secure_url: String,
        public_id: String
    },
    otp: [{
        code: String,
        type: {
            type: String,
            enum: ['confirmEmail', 'confirmPassword'],
        },
        expireIn: Date

    }],
    provider: {
        type: String,
        enum: Object.values(provider),
        default: provider.system
    },
    friends:[{type:mongoose.Schema.Types.ObjectId,ref:'User'}]


},
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
        timestamps: true
    })


userSchema.virtual('userName').get(function () {
    return this.firstName + ' ' + this.lastName

})
userSchema.pre('save', async function (next, doc) {

    this.mobileNumber = await encrypt(this.mobileNumber, process.env.SECRET_KEY_ADMIN)
    next()
})


const userModel = mongoose.models.User || mongoose.model('User', userSchema)

export default userModel