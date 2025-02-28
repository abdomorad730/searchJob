import { Router } from "express";
import { authentecation } from "../../middleware/auth.js";
import { addApps, addJob, deleteJob, getAllJobOrOne, getApps, getJobwithFilter, updateJob } from "./jobs.services.js";
import { validation } from "../../middleware/validation.js";
import { paramsSchema } from "../users/usersValidation.js";
import { paSchema } from "./jobsValidation.js";

const jobRouter=Router({mergeParams:true})
jobRouter.post('/',authentecation,addJob)
jobRouter.patch('/updateJop/:id',authentecation,updateJob)
jobRouter.delete('deleteJop/:id',authentecation,validation(paramsSchema),deleteJob)
jobRouter.get('/getjop/:companyName/:jobId?',authentecation,validation(paSchema),getAllJobOrOne)
jobRouter.get('/filter/:page',authentecation,getJobwithFilter)
jobRouter.get('/apps/:jobId',authentecation,getApps)






export default jobRouter