import { getRepository } from "typeorm";
import { AttachmentEntity } from "../entities/AttachmentEntity";

class AttachmentRepository {

    get repository() {
        return getRepository(AttachmentEntity);
    }

    async create(attachment: AttachmentEntity): Promise<AttachmentEntity> {
        const entity = Object.assign(new AttachmentEntity(), attachment);
        return this.repository.save(entity);
    }

    async findByUUID(uuid: string): Promise<AttachmentEntity> {
        return this.repository.findOne({
            where: {
                uuid,
            },
        });
    }

}

export default new AttachmentRepository();