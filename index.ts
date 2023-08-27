import * as dotenv from 'dotenv';
dotenv.config()
import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
// import cors from 'cors'
import socket from './socket'

const app = express()

const httpServer = createServer(app)

const io = new Server(httpServer , {
    cors: {
        origin : "http://localhost:3000",
        credentials : true
    }
});

app.get('/', (_, res) => {
    res.send('Server is up')
})

httpServer.listen(process.env.PORT,3000, () => {
    console.log("Server is listening on "+process.env.PORT)

    socket({io})
})