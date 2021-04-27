import * as socket from "socket.io";
import { AddParticipantDTO } from "../models/dto/addParticipantDTO";
import { CreateGroupRoomDTO } from "../models/dto/createGroupRoomDTO";
import { CreateMessageDTO } from "../models/dto/createMessageDTO";
import { RemoveParticipantDTO } from "../models/dto/removeParticipantDTO";
import { UpdateGroupRoomDTO } from "../models/dto/updateGroupRoomDTO";
import { IRoom } from "../models/room";
import { VisibleUser } from "../models/visibleUser";
import RoomParticipantRepository from "../repositories/RoomParticipantRepository";
import RoomRepository from "../repositories/RoomRepository";
import UserRepository from "../repositories/UserRepository";
import RoomService from "../services/RoomService";
import RoomMessageSocketController from "../socketControllers/RoomMessageSocketController";
import RoomParticipantSocketController from "../socketControllers/RoomParticipantSocketController";
import RoomSocketController from "../socketControllers/RoomSocketController";
import { SocketAction } from "../utils/constants/socketAction";

export default class RoomSocketFunctions {

    constructor(
        private socket: socket.Socket,
        private io: socket.Server,
    ) {
        this.init();
    }

    private async init() {
        console.log("connected: ", this.socket.id);

        const user: VisibleUser = this.socket.user;

        const userEntity = await UserRepository.findByUUID(user.uuid);

        const rooms = await RoomService.getAllChats(userEntity.id);

        rooms.forEach(room => this.socket.join(room.uuid));
        this.socket.join(user.uuid);

        this.socket.on("join", async (roomUUID: string) => {
            const userEntity = await UserRepository.findByUUID(user.uuid);
            const room = await RoomRepository.findByUUID(roomUUID);
            const isUserRoomParticipant = await RoomParticipantRepository.isUserRoomParticipant(userEntity.id, room.id);
            if (isUserRoomParticipant) {
                this.socket.join(roomUUID);
            }
        });
        this.socket.on("leave", (roomUUID: string) => this.socket.leave(roomUUID));

        this.socket.on(SocketAction.CREATE_MESSAGE, async (props: CreateMessageDTO) => {
            try {
                const response = await RoomMessageSocketController.create(this.socket, props);
                this.socket.to(response.roomUUID).emit(SocketAction.NEW_MESSAGE_RECEIVED, response);
                this.socket.emit(SocketAction.CREATE_MESSAGE_RESPONSE, response);
            } catch (e) { }
        })

        this.socket.on(SocketAction.REMOVE_PARTICIPANT, async (props: RemoveParticipantDTO) => {
            try {
                const response = await RoomParticipantSocketController.removeParticipant(this.socket, props);
                this.io.to(response.roomUUID).emit(SocketAction.REMOVE_PARTICIPANT_RESPONSE, response);
            } catch (e) {
                this.socket.emit(SocketAction.REMOVE_PARTICIPANT_ERROR, e);
            }
        });

        this.socket.on(SocketAction.ADD_PARTICIPANT, async (props: AddParticipantDTO) => {
            try {
                const response = await RoomParticipantSocketController.addParticipant(this.socket, props);
                this.io.to(response.room.uuid).emit(SocketAction.ADD_PARTICIPANT_RESPONSE, response);
            } catch (e) {
                this.socket.emit(SocketAction.ADD_PARTICIPANT_ERROR, e);
            }
        });

        this.socket.on(SocketAction.CREATE_ROOM, async (props: CreateGroupRoomDTO) => {
            try {
                const room = await RoomSocketController.createGroupRoom(this.socket, props);
                this.socket.emit(SocketAction.CREATE_ROOM_RESPONSE, room);
                this.socket.join(room.uuid);
            } catch (e) {
                this.socket.emit(SocketAction.CREATE_ROOM_ERROR, e);
            }
        });

        this.socket.on(SocketAction.LEAVE_ROOM, async (roomUUID: string, callback: (room?: IRoom, error?: string) => void) => {
            try {
                const room = await RoomParticipantSocketController.leaveRoom(this.socket, roomUUID);
                this.socket.to(room.uuid).emit(SocketAction.PARTICIPANT_LEFT_ROOM, room);
                this.socket.leave(room.uuid);
                callback && callback(room);
            } catch (e) {
                callback && callback(null, e);
            }
        })

        this.socket.on(SocketAction.UPDATE_ROOM, async (props: UpdateGroupRoomDTO, callback: (room?: IRoom, error?: string) => void) => {
            try {
                const room = await RoomSocketController.updateGroupRoom(this.socket, props);
                this.socket.to(room.uuid).emit(SocketAction.ROOM_UPDATED, room);
                callback && callback(room);
            } catch (e) {
                callback && callback(null, e);
            }
        })

        this.socket.on(SocketAction.SET_IS_TYPING, (roomUUID: string, isTyping: boolean) => {
            this.socket.to(roomUUID).emit(SocketAction.SET_IS_TYPING, {roomUUID, user: this.socket.user, isTyping});
        })

        this.socket.on(SocketAction.READ_ROOM_MESSAGES, (roomUUID: string) => RoomMessageSocketController.readRoomMessages(this.socket, roomUUID));
    }

}