import { getRepository } from 'typeorm';
import { RoomTypeEntity } from '../entities/RoomTypeEntity';

class RoomTypeRepository {

    get repository() {
        return getRepository(RoomTypeEntity);
    }

    async findById(id: number): Promise<RoomTypeEntity | undefined> {
        return this.repository.findOne({
            where: { id },
        });
    }

    async findByCdRoomType(cdRoomType: string): Promise<RoomTypeEntity | undefined> {
        return this.repository.findOne({
            where: { cdRoomType },
        });
    }

}

export default new RoomTypeRepository();