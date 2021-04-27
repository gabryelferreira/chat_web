import { config } from 'dotenv';
config();
import './utils/axios';
import express from 'express';
import 'express-async-errors';
import Routes from './routes';
import { errorHandler } from './utils/errorHandler';
import cors from 'cors';
import { createConn } from './db/createConn';
import { VisibleUser } from './models/visibleUser';
import http from 'http';
import socket from 'socket.io';
import Socket from './utils/helpers/Socket';
import { socketMiddleware } from './middlewares/SocketMiddleware';
import { SocketAction } from './utils/constants/socketAction';
import RoomSocketFunctions from './socketFunctions/RoomSocketFunctions';

declare global {
    namespace Express {
        interface Request {
            user?: VisibleUser
        }
    }
    namespace SocketIO {
        interface Socket {
            user: VisibleUser;
        }
    }
}

async function boostrap() {
    await createConn();

    const app = express();

    app.use(cors());
    app.use(express.json());
    const routes = new Routes().routes;
    app.use(routes);
    app.use(errorHandler);

    const server = http.createServer(app);

    Socket.io = socket(server);

    const io = Socket.io;

    io.use(socketMiddleware);

    io.on('connection', async (socket) => {

        new RoomSocketFunctions(socket, io);

        socket.on('disconnecting', () => {
            const rooms = Object.keys(socket.rooms);

            rooms.forEach(room => {
                socket.to(room).emit(SocketAction.SET_IS_TYPING, {roomUUID: room, user: socket.user, isTyping: false});
            });
        });

        socket.on('disconnect', () => {
            console.log("disconnected: ", socket.id);
        });
    });

    const PORT = process.env.PORT || 8080;

    server.listen(PORT, () => {
        console.log(`listening on ${PORT}`)
    })
}

boostrap();