import { testConnection } from "./DB/DBconnection.js"
import userRouter from "./modules/users/users.controller.js"
import { globalHundler } from "./utils/asyncHandler/asyncHandler.js"
import { rateLimit } from 'express-rate-limit'
import path from 'path'
import cors from 'cors'
import companyRouter from "./modules/companies/companies.controller.js"
import { schema } from "./modules/graphQL/graphQLSchema.js"
import { createHandler } from "graphql-http/lib/use/express"
import jobRouter from "./modules/jops/jobs.controller.js"
import chatRouter from "./modules/chat/chat.controller.js"
import appRouter from "./modules/apps/apps.controller.js"


export const bootstrab = (app, express) => {
    const limiter = rateLimit({
        windowMs: 60 * 1000, // 1 minutes
        limit: 15,
        message: 'that is enough',
        standardHeaders: 'draft-8',
        legacyHeaders: false,
    })
    app.use(limiter)
    app.use(cors())
    app.use('/uploads', express.static(path.resolve('src/uploads')))
    app.use(express.json())
    testConnection()
    app.get('/', (req, res) => res.send('Hello World!'))
    app.use('/users', userRouter)
    app.use('/companies', companyRouter)
    app.use('/chat', chatRouter)
    app.use('/apps',appRouter)
    app.use('/graphql',createHandler({schema:schema}))
    app.use('/jobs', jobRouter)
    app.use('*', (req, res, next) => {
        return next(`page not found ${req.originalUrl}`)
    })
    app.use(globalHundler)
}