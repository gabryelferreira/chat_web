import { UserEntity } from "../../entities/UserEntity";
import { VisibleUser, OverrideVisibleUser } from "../../models/visibleUser";
import { RoomParticipantEntity } from "../../entities/RoomParticipantEntity";
import { OverrideParticipant, IParticipant } from "../../models/participant";
import { RoomEntity } from "../../entities/RoomEntity";
import { OverrideRoom, IRoom } from "../../models/room";
import { RoomMessageEntity } from "../../entities/RoomMessageEntity";
import { OverrideMessage, IMessage } from "../../models/message";

class ModelHelper {

    getUserFromUserEntity(user: UserEntity, override: OverrideVisibleUser = {}): VisibleUser {
        return {
            uuid: override.uuid ?? user.uuid,
            email: override.email ?? user.email,
            name: override.name ?? user.name,
            imgUrl: override.imgUrl ?? user.imgUrl,
        }
    }

    getParticipantFromParticipantEntity(participant: RoomParticipantEntity | IParticipant, override: OverrideParticipant = {}): IParticipant {
        return {
            uuid: override.uuid ?? participant.uuid,
            createdAt: override.createdAt ?? participant.createdAt,
            isAdmin: override.isAdmin ?? participant.isAdmin,
            user: {
                uuid: override.user?.uuid ?? participant.user?.uuid,
                email: override.user?.email ?? participant.user?.email,
                name: override.user?.name ?? participant.user?.name,
                imgUrl: override.user?.imgUrl ?? participant.user?.imgUrl,
            },
        }
    }

    getRoomFromRoomEntity(room: RoomEntity, override: OverrideRoom = {}): IRoom {
        return {
            name: override.name ?? room.name,
            uuid: override.uuid ?? room.uuid,
            idRoomType: override.idRoomType ?? room.idRoomType,
            participants: override.participants?.map(p => this.getParticipantFromParticipantEntity(p)) ?? room.participants,
            updatedAt: override.updatedAt ?? room.updatedAt,
            createdAt: override.createdAt ?? room.createdAt,
            unreadMessages: override.unreadMessages ?? 0,
            imgUrl: override.imgUrl ?? room.imgUrl,
        }
    }

    getMessageFromMessageEntity(message: RoomMessageEntity, override: OverrideMessage = {}): IMessage {
        return {
            uuid: override.uuid ?? message.uuid,
            createdAt: override.createdAt ?? message.createdAt,
            message: override.message ?? message.message,
            updatedAt: override.updatedAt ?? message.updatedAt,
            user: {
                uuid: override.user?.uuid ?? message.user?.uuid,
                email: override.user?.email ?? message.user?.email,
                name: override.user?.name ?? message.user?.name,
                imgUrl: override.user?.imgUrl ?? message.user?.imgUrl,
            },
            attachment: {
                uuid: override.attachment?.uuid ?? message.attachment?.uuid,
                type: override.attachment?.type ?? message.attachment?.type,
                url: override.attachment?.url ?? message.attachment?.url,
                height: override.attachment?.height ?? message.attachment?.height,
                width: override.attachment?.width ?? message.attachment?.width,
            },
        }
    }

}

export default new ModelHelper();