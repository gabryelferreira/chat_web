import { Request, Response } from "express";
import UserRepository from "../repositories/UserRepository";
import RoomService from "../services/RoomService";
import { UpdateRoomDTO } from "../models/dto/updateRoomDTO";
import validateModel from "../utils/validateModel";
import RoomParticipantRepository from "../repositories/RoomParticipantRepository";
import RoomRepository from "../repositories/RoomRepository";
import { HttpException } from "../models/httpException";
import { HttpStatus } from "../utils/constants/httpStatus";
import SignedUrlRepository from "../repositories/SignedUrlRepository";
import ModelHelper from "../utils/helpers/ModelHelper";
import { SignedUrlEntity } from "../entities/SignedUrlEntity";

class RoomController {

    async getPrivateChatAndCreateIfNotExists(req: Request, res: Response) {
        const reqUser = req.user!;
        const userUUID = req.params.uuid;

        const room = await RoomService.getPrivateChatAndCreateIfNotExists(reqUser.uuid, userUUID);

        return res.json(room);

    }

    async getAllChats(req: Request, res: Response) {
        const reqUser = req.user!;

        const user = await UserRepository.findByUUID(reqUser.uuid);

        const rooms = await RoomService.getAllChats(user.id);

        return res.json(rooms);

    }

}

export default new RoomController();