import e from "express";
import userModel from "../DB/models/userModel.js";
import cron from'node-cron';

 export const task = cron.schedule('0 */6 * * *', async() => {
    const users =await userModel.find()
    for (const element of users) {
        if(element.otp.length){
            for (const otb of element.otp) {
                if(otb.expireIn.getTime()<Date.now()){
                  const ele=await userModel.findOne({_id:element._id} )
                   ele.otp.splice(element.otp.indexOf(otb),1)
                   ele.save()
                }
            }
        }
    }
  });