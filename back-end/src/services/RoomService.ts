import { RoomEntity } from "../entities/RoomEntity";
import RoomRepository from "../repositories/RoomRepository";
import { RoomTypeEntity } from "../entities/RoomTypeEntity";
import { RoomType } from "../utils/constants/roomType";
import { RoomParticipantEntity } from "../entities/RoomParticipantEntity";
import RoomParticipantRepository from "../repositories/RoomParticipantRepository";
import { UserEntity } from "../entities/UserEntity";
import { VisibleUser } from "../models/visibleUser";
import RoomParticipantsHelper from "../utils/helpers/RoomParticipantsHelper";
import { IParticipant } from "../models/participant";
import RoomMessageRepository from "../repositories/RoomMessageRepository";
import { IRoom } from "../models/room";
import { IMessage } from "../models/message";
import UserRepository from "../repositories/UserRepository";
import { HttpException } from "../models/httpException";
import { HttpStatus } from "../utils/constants/httpStatus";
import SocketEmit from "../utils/helpers/SocketEmit";
import { RoomMessageEntity } from "../entities/RoomMessageEntity";
import ModelHelper from "../utils/helpers/ModelHelper";

class RoomService {

    async getPrivateChatAndCreateIfNotExists(reqUserUUID: string, otherUserUUID: string): Promise<IRoom> {

        const users = await UserRepository.findManyByUUID([reqUserUUID, otherUserUUID]);

        const reqUser = users.find(user => user.uuid === reqUserUUID);

        if (users.length !== 2) {
            throw new HttpException("Usuários não encontrados", HttpStatus.NOT_FOUND);
        }

        const findRoom = await RoomRepository.findPrivateChatByUsersIds(users[0].id, users[1].id);

        if (findRoom) {
            const participantsEntities = await RoomParticipantRepository.getParticipantsByRoomId(findRoom.id);
            const participants = participantsEntities.map(p => ModelHelper.getParticipantFromParticipantEntity(p));

            const myParticipant = participantsEntities.find(p => p.user.uuid === reqUserUUID);

            const otherParticipant = participants.find(p => p.user.uuid !== reqUserUUID);

            const finalRoom = ModelHelper.getRoomFromRoomEntity(findRoom, {
                name: otherParticipant.user.name,
                participants: [otherParticipant],
                unreadMessages: findRoom.totalMessages - myParticipant.readMessages,
                imgUrl: otherParticipant.user.imgUrl,
            })

            return finalRoom;
        }

        const room = new RoomEntity();
        room.idRoomType = RoomType.PRIVATE;

        const createdRoom = await RoomRepository.create(room);

        const usersIds = users.map(user => user.id);

        for (const [_, userId] of usersIds.entries()) {
            const participantEntity = new RoomParticipantEntity();
            participantEntity.user = new UserEntity();
            participantEntity.user.id = userId;
            participantEntity.room = createdRoom;
            await RoomParticipantRepository.create(participantEntity);
        }

        const participants = await RoomParticipantsHelper.getParticipantsByRoomId(createdRoom.id);

        const otherParticipant = participants.find(x => x.user.uuid === otherUserUUID);
        const reqParticipant = participants.find(x => x.user.uuid === reqUserUUID);

        const newRoom: IRoom = ModelHelper.getRoomFromRoomEntity(createdRoom, {
            name: otherParticipant.user.name,
            participants: [otherParticipant],
            imgUrl: otherParticipant.user.imgUrl,
        });

        SocketEmit.createRoom(otherUserUUID, {
            ...newRoom,
            name: reqParticipant.user.name,
            participants: [reqParticipant],
        });

        return newRoom;
    }

    async getAllChats(userId: number): Promise<IRoom[]> {
        const rooms = await RoomParticipantRepository.getRoomsByUserId(userId);
        const roomsIds = rooms.map(r => r.room.id);

        if (roomsIds.length === 0) {
            return [];
        }

        const findRooms = await RoomRepository.findManyByIds(roomsIds);

        const formattedRooms: IRoom[] = findRooms.map(room => {
            const myParticipant = room.participants.find(p => p.user.id === userId);

            if (room.idRoomType === RoomType.PRIVATE) {
                room.participants = room.participants.filter(participant => participant.user.id !== userId);
            }
            const participants: IParticipant[] = room.participants.map(p => ModelHelper.getParticipantFromParticipantEntity(p));

            const roomName = room.idRoomType === RoomType.PRIVATE ? participants[0].user.name : room.name;
            const imgUrl = room.idRoomType === RoomType.PRIVATE ? participants[0].user.imgUrl : room.imgUrl;

            const finalRoom = ModelHelper.getRoomFromRoomEntity(room, {
                participants,
                unreadMessages: room.totalMessages - myParticipant.readMessages,
                imgUrl,
                name: roomName,
            });

            return finalRoom;
        })


        return formattedRooms;
    }

    async getChatMessages(roomId: number, before?: string, limit?: number): Promise<IMessage[]> {
        let startingMessage: RoomMessageEntity;
        if (before) {
            startingMessage = await RoomMessageRepository.findByUUID(before);
        }
        
        let messages: RoomMessageEntity[]

        if (!startingMessage) {
            messages = await RoomMessageRepository.findByRoomId(roomId, limit);
        } else {
            messages = await RoomMessageRepository.findByRoomIdBeforeMessageId(roomId, startingMessage.id, limit);
        }

        const formattedMessages: IMessage[] = messages.map(message => ModelHelper.getMessageFromMessageEntity(message));

        return formattedMessages;
    }

}

export default new RoomService();