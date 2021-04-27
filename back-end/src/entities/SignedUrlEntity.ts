import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, BeforeInsert } from 'typeorm';
import { UserEntity } from './UserEntity';
import { v4 as uuidv4 } from 'uuid';

@Entity({ name: "signed_url" })
export class SignedUrlEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false, unique: true })
    uuid: string;

    @Column({ name: "id_user", nullable: false })
    idUser: number;

    @ManyToOne(() => UserEntity, user => user.id)
    @JoinColumn({ name: "id_user", referencedColumnName: "id" })
    user: UserEntity;

    @Column({ nullable: false })
    url: string;

    @Column({ default: Date.now(), name: "created_at" })
    createdAt: Date;

    @Column()
    height: number;

    @Column()
    width: number;

    @BeforeInsert()
    generateUUID() {
        this.uuid = uuidv4();
    }

}