import RoomParticipantRepository from "../../repositories/RoomParticipantRepository";
import { VisibleUser } from "../../models/visibleUser";
import { IParticipant } from "../../models/participant";
import { RoomParticipantEntity } from "../../entities/RoomParticipantEntity";
import { UserEntity } from "../../entities/UserEntity";

class RoomParticipantsHelper {

    async getParticipantsByRoomId(roomId: number): Promise<IParticipant[]> {
        const participants = await RoomParticipantRepository.getParticipantsByRoomId(roomId);

        const formattedParticipants: IParticipant[] = [];

        participants.forEach((participant) => {
            const user = participant.user;
            formattedParticipants.push({
                uuid: participant.uuid,
                createdAt: participant.createdAt,
                user: {
                    uuid: user.uuid,
                    email: user.email,
                    name: user.name,
                    imgUrl: user.imgUrl,
                },
                isAdmin: participant.isAdmin,
            })
        })

        return formattedParticipants;
    }

    async getUsersByRoomsIds(roomsIds: number[], reqUserId: number): Promise<VisibleUser[]> {
        const participants = await RoomParticipantRepository.getUsersByRoomsIds(roomsIds);

        const users: VisibleUser[] = [];

        participants.forEach((participant) => {
            if (participant.user.id !== reqUserId && !users.find(user => user.uuid === participant.user.uuid)) {
                users.push({
                    uuid: participant.user.uuid,
                    email: participant.user.email,
                    name: participant.user.name,
                    imgUrl: participant.user.imgUrl,
                })
            }
        })

        return users;
    }

    formatParticipant(participant: RoomParticipantEntity, _user?: UserEntity): IParticipant {
        const user = participant.user ? participant.user : _user;
        const finalParticipant: IParticipant = {
            uuid: participant.uuid,
            createdAt: participant.createdAt,
            user: {
                uuid: user.uuid,
                email: user.email,
                name: user.name,
                imgUrl: user.imgUrl,
            },
            isAdmin: participant.isAdmin,
        }
        return finalParticipant;
    }

}

export default new RoomParticipantsHelper();