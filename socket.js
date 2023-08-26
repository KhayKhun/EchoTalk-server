"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("uuid");
const EVENTS = {
    connection: 'connection',
    CLIENT: {
        CREATE_ROOM: 'create_room',
        SEND_ROOM_MESSAGE: 'send_room_message',
        JOIN_ROOM: 'join_room',
        FRESHER: 'fresher'
    },
    SERVER: {
        ROOMS: 'rooms',
        JOINED_ROOM: 'joined_room',
        JOIN_ROOM: 'join_room',
        SEND_ROOM_MESSAGE: 'send_room_message',
        FRESHER: 'fresher'
    }
};
const rooms = {};
const joinedRooms = [];
function socket({ io }) {
    io.on(EVENTS.connection, (socket) => {
        // logger.info(`User connected: ${socket.id}`)
        socket.on(EVENTS.CLIENT.CREATE_ROOM, ({ roomName, owner }) => {
            const date = new Date();
            const roomId = (0, uuid_1.v4)();
            rooms[roomId] = {
                name: roomName,
                owner
            };
            // declare everyone there is a new room
            socket.broadcast.emit(EVENTS.SERVER.ROOMS, rooms);
            // emit back to room creator with all rooms
            socket.emit(EVENTS.SERVER.ROOMS, rooms);
            // emit back to room creator saying you hav joined a room
            socket.join(roomId);
            socket.emit(EVENTS.SERVER.JOINED_ROOM, {
                roomId,
                roomName: rooms[roomId].name,
                username: owner,
                time: `${date.getHours()}:${date.getMinutes()}`,
                message: `${owner} created the server`
            });
            joinedRooms.push(roomId);
        });
        socket.on(EVENTS.CLIENT.SEND_ROOM_MESSAGE, ({ message, roomId, username }) => {
            const date = new Date();
            console.log(roomId, '  -  ', message);
            socket.to(roomId).emit(EVENTS.SERVER.SEND_ROOM_MESSAGE, {
                message,
                username,
                roomId,
                time: `${date.getHours()}:${date.getMinutes()}`
            });
        });
        // Join room message issue 
        socket.on(EVENTS.CLIENT.JOIN_ROOM, ({ joinRoomId, roomName }) => {
            const isJoined = joinedRooms.includes(joinRoomId);
            // console.log(isJoined)
            const date = new Date();
            if (isJoined) {
                socket.join(joinRoomId);
            }
            socket.emit(EVENTS.SERVER.JOIN_ROOM, {
                joinRoomId,
                roomName,
                time: `${date.getHours()}:${date.getMinutes()}`,
                // to show 'You joined message'
                message: isJoined ? undefined : 'You joined the server'
            });
            socket.join(joinRoomId);
            if (!joinedRooms.includes(joinRoomId)) {
                joinedRooms.push(joinRoomId);
            }
        });
        socket.on(EVENTS.CLIENT.FRESHER, ({}) => {
            socket.emit(EVENTS.SERVER.FRESHER, { rooms });
        });
    });
}
exports.default = socket;
