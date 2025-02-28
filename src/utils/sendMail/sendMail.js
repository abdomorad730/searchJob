import { EventEmitter } from 'events';
import { sendEmail } from '../../services/sendEmail.js';
import { customAlphabet } from 'nanoid';
import { hash } from '../index.js';
import { html } from '../../services/email.temp.js';
import userModel from '../../DB/models/userModel.js';


export const eventEmitter = new EventEmitter();

eventEmitter.on('sendMail', async (data) => {
    const { email } = data
    const otp = customAlphabet('0123456789',4)()
    const hashOtp = await hash(otp,process.env.SALT_ROUNDS)
    const OTP={
        code:hashOtp,
        type:'confirmEmail',
        expireIn:Date.now()+(10*1000*60)
    }
    await userModel.updateOne({email},{$push: { otp: OTP } })
    await sendEmail(email, "hallo", html(otp))
});
eventEmitter.on('forgetPassword', async (data) => {
    const { email } = data
    const otp = customAlphabet('0123456789',4)()
    const hashOtp = await hash(otp,process.env.SALT_ROUNDS)
    const OTP={
        code:hashOtp,
        type:'confirmPassword',
        expireIn:Date.now()+(10*1000*60)
    }
    await userModel.updateOne({email},{$push:{otp:OTP}})
    await sendEmail(email, "hallo", html(otp))
});
eventEmitter.on('confirm', async (data) => {
    const { email } = data
    const otp = customAlphabet('0123456789',4)()
    const hashOtp = await hash(otp,process.env.SALT_ROUNDS)
    await userModel.updateOne({email},{otpMail:hashOtp})
    await sendEmail(email, "hallo", html(otp))
}); 
eventEmitter.on('confirmNewMail', async (data) => {
    const { email,id } = data
    const otp = customAlphabet('0123456789',4)()
    const hashOtp = await hash(otp,process.env.SALT_ROUNDS)
    await userModel.updateOne({_id:id},{otpNewMail:hashOtp})
    await sendEmail(email, "hallo", html(otp))
});