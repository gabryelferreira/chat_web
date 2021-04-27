import { getRepository, In, Not, Like } from 'typeorm';
import { UserEntity } from '../entities/UserEntity';
import { CreateUserDTO } from '../models/dto/createUserDTO';

class UserRepository {

    get repository() {
        return getRepository(UserEntity);
    }

    async create(user: CreateUserDTO): Promise<UserEntity> {
        const entity = Object.assign(new UserEntity(), user);
        return this.repository.save(entity);
    }

    async findById(id: number): Promise<UserEntity | undefined> {
        return this.repository.findOne({
            where: { id },
        });
    }

    async findByEmail(email: string): Promise<UserEntity | undefined> {
        return this.repository.findOne({
            where: { email },
            select: ["name", "email", "uuid", "password", "imgUrl"],
        });
    }

    async findByUUID(uuid: string): Promise<UserEntity | undefined> {
        return this.repository.findOne({
            where: { uuid },
        });
    }

    async findManyByUUID(uuid: string[]): Promise<UserEntity[]> {
        return this.repository.find({
            where: { uuid: In(uuid) },
        });
    }

    async findWhereUUIDNot(uuid: string, offset: number, limit: number = 30): Promise<UserEntity[]> {
        return this.repository.find({
            where: {
                uuid: Not(uuid),
            },
            skip: offset * limit,
            take: limit,
        });
    }

    async findByEmailWhereUUIDNot(uuid: string, email: string): Promise<UserEntity[]> {
        return this.repository.find({
            where: {
                email: Like(`${email}%`),
                uuid: Not(uuid),
            },
            take: 30,
        });
    }

    async updateAvatar(uuid: string, imgUrl: string): Promise<void> {
        await this.repository.update({ uuid }, {
            imgUrl
        });
    }

    async updateUserNameAndEmail(id: number, name: string, email: string): Promise<void> {
        await this.repository.update({ id }, {
            name,
            email,
        });
    }

}

export default new UserRepository();