import {Server,Socket} from 'socket.io'
import logger from './utils/logger'
import {v4} from 'uuid'

const EVENTS = {
    connection : 'connection',
    CLIENT : {
        CREATE_ROOM : 'create_room',
        SEND_ROOM_MESSAGE : 'send_room_message',
        JOIN_ROOM : 'join_room',
        FRESHER : 'fresher'
    },
    SERVER : {
        ROOMS : 'rooms',
        JOINED_ROOM : 'joined_room',
        JOIN_ROOM : 'join_room',
        SEND_ROOM_MESSAGE : 'send_room_message',
        FRESHER : 'fresher'
    }
}

const rooms:Record<string, {name : string , owner : string}> = {}

function socket({io} : {io : Server}){
    logger.info('Socket enabled')

    io.on(EVENTS.connection,(socket : Socket) => {
        logger.info(`User connected: ${socket.id}`)
        
    socket.on(EVENTS.CLIENT.CREATE_ROOM,({roomName , owner}) => {
        const roomId = v4()

        rooms[roomId] = {
            name : roomName,
            owner
        }

        // declare everyone there is a new room
        socket.broadcast.emit(EVENTS.SERVER.ROOMS, rooms)
        // emit back to room creator with all rooms
        socket.emit(EVENTS.SERVER.ROOMS, rooms)
        // emit back to room creator saying you hav joined a room
        socket.join(roomId)
        socket.emit(EVENTS.SERVER.JOINED_ROOM, {roomId, roomName : rooms[roomId].name})
    })

    socket.on(EVENTS.CLIENT.SEND_ROOM_MESSAGE, ({message, roomId, username})=>{
        const date = new Date();
        console.log(roomId, '  -  ' , message)
        socket.to(roomId).emit(EVENTS.SERVER.SEND_ROOM_MESSAGE , {
            message,
            username,
            roomId,
            time : `${date.getHours()}:${date.getMinutes()}`
        })
    })

    socket.on(EVENTS.CLIENT.JOIN_ROOM, ({joinRoomId , roomName}) => {
        socket.join(joinRoomId)
        socket.emit(EVENTS.SERVER.JOIN_ROOM , {joinRoomId, roomName})
    })

    socket.on(EVENTS.CLIENT.FRESHER,({})=>{
        socket.emit(EVENTS.SERVER.FRESHER, {rooms})
    })
})
}

export default socket