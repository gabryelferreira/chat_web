import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, BeforeInsert } from 'typeorm';
import { RoomEntity } from './RoomEntity';
import { UserEntity } from './UserEntity';
import { v4 as uuidv4 } from 'uuid';
import { AttachmentEntity } from './AttachmentEntity';

@Entity({ name: "room_message" })
export class RoomMessageEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false, unique: true })
    uuid: string;

    @Column({ name: "id_room", nullable: false })
    idRoom: number;

    @Column({ name: "id_user", nullable: false })
    idUser: number;

    @Column({ name: "id_attachment" })
    idAttachment: number;

    @Column({ nullable: false })
    message: string;

    @ManyToOne(() => RoomEntity, room => room.id)
    @JoinColumn({ name: "id_room", referencedColumnName: "id" })
    room: RoomEntity;

    @ManyToOne(() => UserEntity, user => user.id)
    @JoinColumn({ name: "id_user", referencedColumnName: "id" })
    user: UserEntity;

    @ManyToOne(() => AttachmentEntity, attachment => attachment.id)
    @JoinColumn({ name: "id_attachment", referencedColumnName: "id" })
    attachment: AttachmentEntity;

    @Column({ default: Date.now(), name: "created_at" })
    createdAt: Date;

    @Column({ default: Date.now(), name: "updated_at" })
    updatedAt: Date;

    @BeforeInsert()
    generateUUID() {
        this.uuid = uuidv4();
    }

}