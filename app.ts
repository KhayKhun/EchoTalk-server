import * as dotenv from 'dotenv';
dotenv.config()
import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
// import cors from 'cors'
import config from 'config'

import socket from './socket'

const port = config.get<number>("port")
const host = config.get<string>("host")
const corsOrigin = config.get<string>("corsOrigin")
const app = express()

const httpServer = createServer(app)

const io = new Server(httpServer , {
    cors: {
        origin : corsOrigin,
        credentials : true
    }
});

app.get('/', (req, res) => {
    res.send('Server is up')
})

httpServer.listen(process.env.PORT, () => {
    console.log("  Server is listening")

    socket({io})
})