import companyModel from "../../DB/models/companyModel.js"
import userModel from "../../DB/models/userModel.js"
import { decodeTokenGraph } from "../../services/decodeToken.js"
import { roles } from "../../services/object.js"


export const getAllUser=async (perant,args)=>{
    const {  authorization } = args
     await decodeTokenGraph(authorization,[roles.admin])
    const data=await userModel.find()
    return {msg:'done',data}
}
export const getAllCompany=async (perant,args)=>{
    const {  authorization } = args
   await decodeTokenGraph(authorization,[ roles.admin])
    const data=await companyModel.find()
    return {msg:'done',data}

}