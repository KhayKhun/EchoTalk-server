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
        origin : "https://echotalk.vercel.app/",
        credentials : true
    }
});

app.get('/', (_, res) => {
    res.send('Server is up')
})

httpServer.listen(5000,"localhost", () => {
    console.log("Server is listening on "+5000)

    socket({io})
})