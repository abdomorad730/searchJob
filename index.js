import dotenv from 'dotenv'
import path from 'path'
dotenv.config({path:path.resolve('./config/.env')})
import express from 'express'
import { bootstrab } from './src/app.controller.js'
import { task } from './src/services/schedule.js'
import { runIo } from './src/modules/chat/chat.socket.js'

const app = express()
const port = process.env.PORT


task.start()
bootstrab(app,express)


const server=app.listen(port, () => console.log(`Example app listening on port ${port}!`))
runIo(server)