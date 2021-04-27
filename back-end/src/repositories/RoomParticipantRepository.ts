import { getRepository, In } from 'typeorm';
import { RoomParticipantEntity } from '../entities/RoomParticipantEntity';
import { VisibleUser } from '../models/visibleUser';

class RoomParticipantRepository {

    get repository() {
        return getRepository(RoomParticipantEntity);
    }

    create(roomParticipant: RoomParticipantEntity): Promise<RoomParticipantEntity> {
        const entity = Object.assign(new RoomParticipantEntity(), roomParticipant);
        return this.repository.save(entity);
    }

    getParticipantsByRoomId(roomId: number): Promise<RoomParticipantEntity[]> {
        return this.repository.find({
            where: {
                room: {
                    id: roomId,
                }
            },
            relations: ["user"],
        })
    }

    getRoomsByUserId(userId: number): Promise<RoomParticipantEntity[]> {
        return this.repository.find({
            where: {
                user: {
                    id: userId,
                }
            },
            relations: ["room"],
        });
    }

    getRoomsIdsByUserUUID(userUUID: string): Promise<RoomParticipantEntity[]> {
        return this.repository.find({
            where: {
                user: {
                    uuid: userUUID,
                }
            }
        })
    }

    getUsersByRoomsIds(roomIds: number[]): Promise<RoomParticipantEntity[]> {
        return this.repository.find({
            where: {
                room: {
                    id: In(roomIds),
                }
            },
            relations: ["user"],
        })
    }

    async isUserRoomParticipant(userId: number, roomId: number): Promise<boolean> {
        return !!(await this.repository.findOne({
            where: {
                idUser: userId,
                idRoom: roomId,
            }
        }))
    }

    async isUserRoomAdmin(userId: number, roomId: number): Promise<boolean> {
        return !!(await this.repository.findOne({
            where: {
                idUser: userId,
                idRoom: roomId,
                isAdmin: true,
            }
        }))
    }

    async setLastSeenAt(userId: number, roomId: number): Promise<void> {
        await this.repository.createQueryBuilder()
            .update()
            .set({ lastSeenAt: () => "CURRENT_TIMESTAMP" })
            .where("id_user = :userId AND id_room = :roomId", { userId, roomId })
            .execute();
    }

    async deleteById(id: number): Promise<void> {
        await this.repository.delete({ id });
    }

    async findById(id: number): Promise<RoomParticipantEntity> {
        return this.repository.findOne({
            where: {
                id,
            },
            relations: ["user"],
        })
    }

    async deleteByRoomId(roomId: number): Promise<void> {
        await this.repository.delete({ idRoom: roomId });
    }

    async setIsAdmin(id: number, isAdmin: boolean): Promise<void> {
        await this.repository.update({ id }, {
            isAdmin,
        });
    }

    async setReadMessages(userId: number, roomId: number, readMessages: number): Promise<void> {
        await this.repository.update({ idUser: userId, idRoom: roomId }, {
            readMessages,
        });
    }

}

export default new RoomParticipantRepository();