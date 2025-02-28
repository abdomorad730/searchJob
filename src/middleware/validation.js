

export const validation = (schema) => {
    return (req, res, next) => {
    let errors=[]
        for (const key of Object.keys(schema)) {
            const validationError = schema[key].validate(req[key], { abortEarly: false })
            if (validationError?.error) {
                errors.push(validationError.error.details)
            }
        }
        if(errors.length){
            return res.json({errors})
        }
        next()
    }
}