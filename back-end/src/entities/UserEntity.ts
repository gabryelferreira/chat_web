import { Entity, PrimaryGeneratedColumn, Column, OneToMany, BeforeInsert } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import BCryptHelper from '../utils/helpers/BCryptHelper';

@Entity({ name: "user" })
export class UserEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false, unique: true })
    uuid: string;

    @Column({ nullable: false, unique: true })
    email: string;

    @Column({ nullable: false })
    name: string;

    @Column({ nullable: false, select: false })
    password: string;

    @Column({ name: "img_url" })
    imgUrl: string;

    @Column({ default: Date.now(), name: "created_at", select: false })
    createdAt: Date;

    @Column({ default: Date.now(), name: "updated_at", select: false })
    updatedAt: Date;

    @BeforeInsert()
    generateUUID() {
        this.uuid = uuidv4();
    }

    @BeforeInsert()
    async hashPassword() {
        this.password = await BCryptHelper.hash(this.password);
    }
}