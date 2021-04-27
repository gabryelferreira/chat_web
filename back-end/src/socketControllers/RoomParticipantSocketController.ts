import * as socket from "socket.io";
import validateModel from "../utils/validateModel";
import { RemoveParticipantDTO } from "../models/dto/removeParticipantDTO";
import RoomRepository from "../repositories/RoomRepository";
import RoomParticipantsHelper from "../utils/helpers/RoomParticipantsHelper";
import { RoomType } from "../utils/constants/roomType";
import RoomParticipantRepository from "../repositories/RoomParticipantRepository";
import { RemoveParticipantResponseDTO } from "../models/dto/removeParticipantResponseDTO";
import { RoomParticipantEntity } from "../entities/RoomParticipantEntity";
import { AddParticipantDTO } from "../models/dto/addParticipantDTO";
import UserRepository from "../repositories/UserRepository";
import { AddParticipantResponseDTO } from "../models/dto/addParticipantResponseDTO";
import { IRoom } from "../models/room";
import ModelHelper from "../utils/helpers/ModelHelper";
import { SocketAction } from "../utils/constants/socketAction";
import RoomMessageRepository from "../repositories/RoomMessageRepository";

class RoomParticipantSocketController {

    async removeParticipant(socket: socket.Socket, props: RemoveParticipantDTO) {
        const user = socket.user;
        const removeParticipantDTO = new RemoveParticipantDTO(props);

        await validateModel(removeParticipantDTO);

        const room = await RoomRepository.findByUUID(props.roomUUID);

        if (!room) {
            throw new Error("Não conseguimos encontrar o chat especificado. Recarregue a página e tente novamente.");
        }

        if (room.idRoomType !== RoomType.GROUP) {
            throw new Error("Não é possível remover usuários de uma conversa privada.");
        }

        const participants = await RoomParticipantRepository.getParticipantsByRoomId(room.id);

        const reqUserParticipant = participants.find(p => p.user.uuid === user.uuid);

        if (!reqUserParticipant || !reqUserParticipant.isAdmin) {
            throw new Error("Você não possui permissão para remover o usuário do grupo.");
        }

        const findParticipant = participants.find(p => p.uuid === props.participantUUID);

        if (!findParticipant) {
            throw new Error("Não conseguimos encontrar o usuário que você tentou remover. Recarregue a página e tente novamente.");
        }

        await RoomParticipantRepository.deleteById(findParticipant.id);

        const participant = RoomParticipantsHelper.formatParticipant(findParticipant);

        const response = new RemoveParticipantResponseDTO({
            roomUUID: props.roomUUID,
            participant,
        })

        return response;
    }

    async addParticipant(socket: socket.Socket, props: AddParticipantDTO) {
        const reqUser = socket.user;
        const addParticipantDTO = new AddParticipantDTO(props);

        await validateModel(addParticipantDTO);

        const room = await RoomRepository.findByUUID(props.roomUUID);

        if (!room) {
            throw new Error("Não conseguimos encontrar o chat especificado. Recarregue a página e tente novamente.");
        }

        if (room.idRoomType !== RoomType.GROUP) {
            throw new Error("Não é possível adicionar usuários a uma conversa privada.");
        }

        const participants = await RoomParticipantRepository.getParticipantsByRoomId(room.id);

        const reqUserParticipant = participants.find(p => p.user.uuid === reqUser.uuid);

        if (!reqUserParticipant || !reqUserParticipant.isAdmin) {
            throw new Error("Você não possui permissão para adicionar o usuário do grupo.");
        }

        const findParticipant = participants.find(p => p.user.uuid === props.userUUID);

        if (findParticipant) {
            throw new Error("O usuário já pertence ao grupo.");
        }

        const userToInsert = await UserRepository.findByUUID(addParticipantDTO.userUUID);

        if (!userToInsert) {
            throw new Error("Não encontramos no sistema o usuário que você tentou adicionar ao grupo.");
        }

        const entity = new RoomParticipantEntity();
        entity.idUser = userToInsert.id;
        entity.idRoom = room.id;

        const createdParticipant = await RoomParticipantRepository.create(entity);

        const participant = RoomParticipantsHelper.formatParticipant(createdParticipant, userToInsert);

        const finalParticipants = [...participants, participant];

        const newRoom: IRoom = ModelHelper.getRoomFromRoomEntity(room, {
            idRoomType: RoomType.GROUP,
            participants: finalParticipants,
        });

        const response = new AddParticipantResponseDTO({
            room: newRoom,
            participant,
        })

        socket.to(addParticipantDTO.userUUID).emit(SocketAction.ADD_PARTICIPANT_RESPONSE, response);

        return response;
    }

    async leaveRoom(socket: socket.Socket, roomUUID: string) {

        const reqUser = socket.user;

        if (!roomUUID) {
            throw new Error("Chat não encontrado.");
        }

        const room = await RoomRepository.findByUUID(roomUUID);

        if (!room) {
            throw new Error("Não conseguimos encontrar o chat especificado. Recarregue a página e tente novamente.");
        }

        if (room.idRoomType !== RoomType.GROUP) {
            throw new Error("Não é possível sair de uma conversa privada.");
        }

        const participants = await RoomParticipantRepository.getParticipantsByRoomId(room.id);

        const userParticipant = participants.find(x => x.user.uuid === reqUser.uuid);

        if (!userParticipant) {
            throw new Error("Você não está no grupo.");
        }

        await RoomParticipantRepository.deleteById(userParticipant.id);

        const finalParticipants = participants.filter(p => p.user.uuid !== reqUser.uuid);

        if (finalParticipants.length === 0) {
            await RoomMessageRepository.deleteByRoomId(room.id);
            await RoomParticipantRepository.deleteByRoomId(room.id);
            await RoomRepository.deleteById(room.id);
        } else {
            const admins = finalParticipants.filter(p => p.isAdmin);
    
            if (admins.length === 0) {
                finalParticipants[0].isAdmin = true;
                await RoomParticipantRepository.setIsAdmin(finalParticipants[0].id, true);
            }
        }


        const finalRoom: IRoom = ModelHelper.getRoomFromRoomEntity(room, {
            participants: finalParticipants,
        });

        return finalRoom;
    }

}

export default new RoomParticipantSocketController();