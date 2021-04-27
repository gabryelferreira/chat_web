import { getRepository } from "typeorm";
import { SignedUrlEntity } from "../entities/SignedUrlEntity";

class SignedUrlRepository {

    get repository() {
        return getRepository(SignedUrlEntity);
    }

    async create(url: string, idUser: number, height: number, width: number): Promise<SignedUrlEntity> {
        const model = new SignedUrlEntity();
        model.url = url;
        model.idUser = idUser;
        model.height = height;
        model.width = width;
        return this.repository.save(model);
    }

    async findByUUID(uuid: string): Promise<SignedUrlEntity> {
        return this.repository.findOne({
            where: {
                uuid,
            },
        });
    }

    async delete(id: number): Promise<void> {
        await this.repository.delete({ id });
    }

}

export default new SignedUrlRepository();