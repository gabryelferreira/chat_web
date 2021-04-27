import socket from 'socket.io';
import { SocketUser } from '../../models/socketUser';

export default class Socket {
    static io: socket.Server;
}