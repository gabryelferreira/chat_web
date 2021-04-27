import { getRepository, LessThan } from "typeorm";
import { RoomMessageEntity } from "../entities/RoomMessageEntity";
import { IUnreadMessage } from "../models/unreadMessage";

class RoomMessageRepository {

    get repository() {
        return getRepository(RoomMessageEntity);
    }

    async create(message: RoomMessageEntity): Promise<RoomMessageEntity> {
        const entity = Object.assign(new RoomMessageEntity(), message);
        return this.repository.save(entity);
    }

    async findByUUID(uuid: string): Promise<RoomMessageEntity> {
        return this.repository.findOne({
            where: {
                uuid,
            },
        })
    }

    async findByRoomId(roomId: number, limit: number = 50): Promise<RoomMessageEntity[]> {
        return this.repository.find({
            where: {
                idRoom: roomId,
            },
            take: limit,
            order: {
                id: "DESC",
            },
            relations: ["user", "attachment"],
        })
    }

    async findByRoomIdBeforeMessageId(roomId: number, messageId: number, limit: number = 50): Promise<RoomMessageEntity[]> {
        return this.repository.find({
            where: {
                idRoom: roomId,
                id: LessThan(messageId),
            },
            take: limit,
            order: {
                id: "DESC",
            },
            relations: ["user", "attachment"],
        })
    }
    
    // async getUnreadMessages(roomIds: number[], userId: number): Promise<IUnreadMessage[]> {
    //     let roomIdsString = '';
    //     roomIds.forEach((roomId, index) => {
    //         roomIdsString += `${roomId}`;
    //         if (index < roomIds.length - 1) {
    //             roomIdsString += `, `;
    //         }
    //     })
    //     return this.repository.query(`
    //             SELECT room_message.id_room as idRoom,
    //                 COUNT(room_message.id) as unreadMessages
    //             FROM room_message
    //             INNER JOIN room_participant
    //                 ON room_participant.id_user = room_message.id_user
    //                 AND room_participant.id_room = room_message.id_room
    //             WHERE room_message.created_at > (
    //                 SELECT 
    //                 CASE
    //                     WHEN rp.last_seen_at is NULL then TIMESTAMP('2000-01-01')
    //                     ELSE rp.last_seen_at
    //                 END as data
    //                 FROM room_participant rp 
    //                 WHERE rp.id_room = room_participant.id_room AND rp.id_user = ${userId}
    //             )
    //             AND room_message.id_user <> ${userId}
    //             AND room_message.id_room IN (${roomIdsString})
    //             GROUP by room_message.id_room`)
    // }

    async deleteByRoomId(roomId: number): Promise<void> {
        await this.repository.delete({ idRoom: roomId });
    }

}

export default new RoomMessageRepository();