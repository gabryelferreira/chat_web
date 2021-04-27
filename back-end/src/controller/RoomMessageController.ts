import { Request, Response } from "express";
import RoomService from "../services/RoomService";
import RoomRepository from "../repositories/RoomRepository";
import { HttpException } from "../models/httpException";
import { HttpStatus } from "../utils/constants/httpStatus";
import UserRepository from "../repositories/UserRepository";
import RoomParticipantRepository from "../repositories/RoomParticipantRepository";
import RoomMessageRepository from "../repositories/RoomMessageRepository";
import { RoomMessageEntity } from "../entities/RoomMessageEntity";
import { CreateMessageDTO } from "../models/dto/createMessageDTO";
import validateModel from "../utils/validateModel";
import Socket from "../utils/helpers/Socket";
import { IMessage } from "../models/message";
import { IAction } from "../models/action";
import { SocketAction } from "../utils/constants/socketAction";
import SocketEmit from "../utils/helpers/SocketEmit";
import RoomParticipantsHelper from "../utils/helpers/RoomParticipantsHelper";

class RoomMessageController {

    async getChatMessages(req: Request, res: Response) {
        const reqUser = req.user!;

        const roomUUID = req.params.uuid;

        const before = req.query.before as string;
        const limit = parseInt(req.query.limit as string);

        const room = await RoomRepository.findByUUID(roomUUID);

        if (!room) {
            throw new HttpException("Chat não encontrado", HttpStatus.NOT_FOUND);
        }

        const user = await UserRepository.findByUUID(reqUser.uuid);

        const isUserRoomParticipant = await RoomParticipantRepository.isUserRoomParticipant(user.id, room.id);

        if (!isUserRoomParticipant) {
            throw new HttpException("Você não tem permissão para ler as mensagens desse chat.", HttpStatus.UNAUTHORIZED);
        }

        await RoomParticipantRepository.setLastSeenAt(user.id, room.id);

        await RoomParticipantRepository.setReadMessages(user.id, room.id, room.totalMessages);

        const messages = await RoomService.getChatMessages(room.id, before, limit > 50 ? 50 : limit);

        return res.json(messages.reverse());
    }

}

export default new RoomMessageController();