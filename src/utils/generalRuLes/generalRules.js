import Joi from "joi"
import { Types } from "mongoose"

export const customValid = (value,helper)=>{
    const checkId=Types.ObjectId.isValid(value)
    return checkId?value:helper.message(`${value} is not a valid id`)
}
function customDate(value,helper){
    const x = new Date(value).getTime()
    return  x<Date.now()? value:helper.message(`${value} is not a valid Date`)
    //^\d{4}[\-\-](0?[1-9]|1[012])[\-\-](0?[1-9]|[12][0-9]|3[01])$
}
function customvalue(value,helper){
    return value>=11&&value<=20?value:helper.message(`${value} is not a valid value`)
    //^\d{4}[\-\-](0?[1-9]|1[012])[\-\-](0?[1-9]|[12][0-9]|3[01])$
}
export const generalRules= {
    id:Joi.string().custom(customValid),
    value:Joi.number().custom(customvalue),
    Date:Joi.string().custom(customDate).pattern(/^\d{4}[\-\-](0?[1-9]|1[012])[\-\-](0?[1-9]|[12][0-9]|3[01])$/),
    headers:Joi.object({
        authorization:Joi.string().required()
    })
}