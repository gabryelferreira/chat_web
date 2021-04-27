import { SocketUser } from "../models/socketUser";

import * as socket from "socket.io";
import { CreateMessageDTO } from "../models/dto/createMessageDTO";
import validateModel from "../utils/validateModel";
import { VisibleUser } from "../models/visibleUser";
import RoomRepository from "../repositories/RoomRepository";
import { HttpException } from "../models/httpException";
import { HttpStatus } from "../utils/constants/httpStatus";
import UserRepository from "../repositories/UserRepository";
import RoomParticipantsHelper from "../utils/helpers/RoomParticipantsHelper";
import { RoomMessageEntity } from "../entities/RoomMessageEntity";
import RoomMessageRepository from "../repositories/RoomMessageRepository";
import { IMessage } from "../models/message";
import SocketEmit from "../utils/helpers/SocketEmit";
import { SocketAction } from "../utils/constants/socketAction";
import { CreateMessageResponseDTO } from "../models/dto/createMessageResponseDTO";
import RoomParticipantRepository from "../repositories/RoomParticipantRepository";
import ModelHelper from "../utils/helpers/ModelHelper";
import { SignedUrlEntity } from "../entities/SignedUrlEntity";
import SignedUrlRepository from "../repositories/SignedUrlRepository";
import { FileType } from "../utils/constants/fileType";
import FileTypeHelper from "../utils/helpers/FileTypeHelper";
import { AttachmentEntity } from "../entities/AttachmentEntity";
import AttachmentRepository from "../repositories/AttachmentRepository";

class RoomMessageSocketController {

    async create(socket: socket.Socket, props: CreateMessageDTO) {
        const model = new CreateMessageDTO(props);
        await validateModel(model);

        const reqUser = socket.user;

        const roomUUID = props.roomUUID;

        const room = await RoomRepository.findByUUID(roomUUID);

        if (!room) {
            throw new Error("Chat não encontrado.");
        }

        const user = await UserRepository.findByUUID(reqUser.uuid);

        const participants = await RoomParticipantsHelper.getParticipantsByRoomId(room.id);

        const isUserRoomParticipant = participants.find(x => x.user.uuid === reqUser.uuid);

        if (!isUserRoomParticipant) {
            throw new Error("Usuário não é participante do chat.");
        }

        
        let attachment: AttachmentEntity;
        let signedUrl: SignedUrlEntity;
        let fileType: FileType;

        if (model.attachmentSignedUrlUUID) {
            signedUrl = await SignedUrlRepository.findByUUID(model.attachmentSignedUrlUUID);
            fileType = FileTypeHelper.getFileTypeByUrl(signedUrl?.url);
            if (!fileType) {
                throw new Error("Arquivo não encontrado.");
            }
            const attachmentEntity = new AttachmentEntity();
            attachmentEntity.type = fileType;
            attachmentEntity.url = signedUrl.url;
            attachmentEntity.idUser = user.id;
            attachmentEntity.height = signedUrl.height;
            attachmentEntity.width = signedUrl.width;
            attachment = await AttachmentRepository.create(attachmentEntity);
        }

        if (!signedUrl && !model.message && !model.message.trim()) {
            throw new Error("Mensagem ou arquivo são obrigatórios.");
        }

        

        const messageEntity = new RoomMessageEntity();
        messageEntity.idRoom = room.id;
        messageEntity.idUser = user.id;
        messageEntity.message = model.message;
        messageEntity.idAttachment = attachment?.id;

        const createdMessage = await RoomMessageRepository.create(messageEntity);

        const roomTotalMessages = room.totalMessages + 1;

        await RoomRepository.updateRoomTotalMessages(room.id, roomTotalMessages);

        await RoomParticipantRepository.setReadMessages(user.id, room.id, roomTotalMessages);

        const message: IMessage = ModelHelper.getMessageFromMessageEntity(createdMessage, {
            user,
            attachment,
        })

        const response = new CreateMessageResponseDTO({
            fakeMessageUUID: model.fakeMessageUUID,
            message,
            roomUUID: model.roomUUID,
        })

        return response;

    }

    async readRoomMessages(socket: socket.Socket, roomUUID: string) {
        const reqUser = socket.user;

        const room = await RoomRepository.findByUUID(roomUUID);

        if (!room) {
            return;
        }

        const user = await UserRepository.findByUUID(reqUser.uuid);

        await RoomParticipantRepository.setLastSeenAt(user.id, room.id);

        await RoomParticipantRepository.setReadMessages(user.id, room.id, room.totalMessages);
    }

}

export default new RoomMessageSocketController();