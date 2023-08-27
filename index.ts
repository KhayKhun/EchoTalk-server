import * as dotenv from 'dotenv';
dotenv.config()
import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
// import cors from 'cors'
import socket from './socket'

const config = require('config');

const port = config.get('port');
const host = config.get('host');
const corsOrigin = config.get('corsOrigin');

const app = express()

const httpServer = createServer(app)

const io = new Server(httpServer , {
    cors: {
        origin : corsOrigin,
        credentials : true
    }
});

app.get('/', (_, res) => {
    res.send('Server is up')
})

httpServer.listen(port,host, () => {
    console.log("Server is listening on "+port)

    socket({io})
})