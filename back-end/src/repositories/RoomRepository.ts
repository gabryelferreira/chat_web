import { RoomEntity } from '../entities/RoomEntity';
import { getRepository, In } from 'typeorm';

class RoomRepository {

    get repository() {
        return getRepository(RoomEntity);
    }

    async create(room: RoomEntity): Promise<RoomEntity> {
        const entity = Object.assign(new RoomEntity(), room);
        return this.repository.save(entity);
    }

    async findById(id: number): Promise<RoomEntity> {
        return this.repository.findOne({
            where: {
                id,
            },
        });
    }

    async deleteById(id: number): Promise<void> {
        await this.repository.delete({ id });
    }

    async findByUUID(uuid: string): Promise<RoomEntity> {
        return this.repository.findOne({
            where: {
                uuid,
            },
        });
    }

    async findPrivateChatByUsersIds(myId: number, userId: number): Promise<RoomEntity> {
        return this.repository.createQueryBuilder("room")
            .select([
                "room.id",
                "room.uuid",
                "room.updatedAt",
                "room.idRoomType",
            ])
            .innerJoin("room.participants", "room_participant")
            .where(`room_participant.id_user IN (${myId}, ${userId})
                AND room.id_room_type = 1`)
            .groupBy("room.id")
            .having("COUNT(*) = 2")
            .getOne();
    }
    
    findManyByIds(roomsIds: number[]): Promise<RoomEntity[]> {
        return this.repository.find({
            where: {
                id: In(roomsIds),
            },
            relations: ["participants", "participants.user"],
        });
    }

    async updateRoomInfo(id: number, name: string, imgUrl: string): Promise<void> {
        await this.repository.update({ id }, {
            name,
            imgUrl,
        });
    }

    async updateRoomTotalMessages(id: number, totalMessages: number): Promise<void> {
        await this.repository.update({ id }, {
            totalMessages,
        });
    }

}

export default new RoomRepository();