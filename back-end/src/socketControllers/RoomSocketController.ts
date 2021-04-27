import * as socket from "socket.io";
import { CreateGroupRoomDTO } from "../models/dto/createGroupRoomDTO";
import validateModel from "../utils/validateModel";
import { RoomEntity } from "../entities/RoomEntity";
import { RoomTypeEntity } from "../entities/RoomTypeEntity";
import { RoomType } from "../utils/constants/roomType";
import RoomRepository from "../repositories/RoomRepository";
import RoomParticipantsHelper from "../utils/helpers/RoomParticipantsHelper";
import { IRoom } from "../models/room";
import ModelHelper from "../utils/helpers/ModelHelper";
import { RoomParticipantEntity } from "../entities/RoomParticipantEntity";
import UserRepository from "../repositories/UserRepository";
import RoomParticipantRepository from "../repositories/RoomParticipantRepository";
import { SignedUrlEntity } from "../entities/SignedUrlEntity";
import SignedUrlRepository from "../repositories/SignedUrlRepository";
import { UpdateGroupRoomDTO } from "../models/dto/updateGroupRoomDTO";

class RoomSocketController {

    async createGroupRoom(socket: socket.Socket, props: CreateGroupRoomDTO) {
        const reqUser = socket.user;
        const createGroupDTO = new CreateGroupRoomDTO(props);

        await validateModel(createGroupDTO);

        let signedUrlEntity: SignedUrlEntity;
        if (createGroupDTO.signedUrlUUID) {
            signedUrlEntity = await SignedUrlRepository.findByUUID(createGroupDTO.signedUrlUUID);
            if (!signedUrlEntity) {
                throw new Error("Imagem não encontrada.");
            }
        }

        const room = new RoomEntity();
        room.name = createGroupDTO.name;
        room.roomType = new RoomTypeEntity();
        room.roomType.id = RoomType.GROUP;
        room.imgUrl = signedUrlEntity?.url;

        const createdRoom = await RoomRepository.create(room);

        const user = await UserRepository.findByUUID(reqUser.uuid);

        const participantEntity = new RoomParticipantEntity();
        participantEntity.idUser = user.id;
        participantEntity.idRoom = createdRoom.id;
        participantEntity.isAdmin = true;
        await RoomParticipantRepository.create(participantEntity);

        const findRoom = await RoomRepository.findById(createdRoom.id);

        const participants = await RoomParticipantsHelper.getParticipantsByRoomId(findRoom.id);

        const newRoom: IRoom = ModelHelper.getRoomFromRoomEntity(findRoom, {
            idRoomType: RoomType.GROUP,
            participants,
        });

        return newRoom;
    }

    async updateGroupRoom(socket: socket.Socket, props: UpdateGroupRoomDTO) {
        const reqUser = socket.user;
        const updateGroupDTO = new UpdateGroupRoomDTO(props);
        await validateModel(updateGroupDTO);

        const user = await UserRepository.findByUUID(reqUser.uuid);

        const room = await RoomRepository.findByUUID(props.roomUUID);
        
        const isAdmin = await RoomParticipantRepository.isUserRoomAdmin(user.id, room.id);

        if (!isAdmin) {
            throw new Error("Você não tem permissão para editar as informações do grupo.");
        }

        let signedUrlEntity: SignedUrlEntity;
        let imgUrl: string = room.imgUrl;

        if (props.signedUrlUUID) {
            signedUrlEntity = await SignedUrlRepository.findByUUID(props.signedUrlUUID);
            if (!signedUrlEntity) {
                throw new Error("A imagem não foi encontrada.");
            }
            imgUrl = signedUrlEntity.url;
        } else if (props.removeImage) {
            imgUrl = null;
        }

        await RoomRepository.updateRoomInfo(room.id, props.name, imgUrl);

        room.imgUrl = imgUrl;

        const finalRoom = ModelHelper.getRoomFromRoomEntity(room, {
            name: props.name,
        });

        return finalRoom;
    }

}

export default new RoomSocketController();