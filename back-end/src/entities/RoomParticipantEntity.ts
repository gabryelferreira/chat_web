import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, BeforeInsert } from 'typeorm';
import { RoomEntity } from './RoomEntity';
import { UserEntity } from './UserEntity';
import { v4 as uuidv4 } from 'uuid';

@Entity({ name: "room_participant" })
export class RoomParticipantEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false, unique: true })
    uuid: string;

    @Column({ name: "id_room", nullable: false })
    idRoom: number;

    @Column({ name: "id_user", nullable: false })
    idUser: number;

    @Column({ name: "is_admin", default: false })
    isAdmin: boolean;

    @Column({ name: "read_messages", default: 0 })
    readMessages: number;

    @ManyToOne(() => RoomEntity, { nullable: false })
    @JoinColumn({ name: "id_room", referencedColumnName: "id" })
    room: RoomEntity;

    @ManyToOne(() => UserEntity, { nullable: false })
    @JoinColumn({ name: "id_user", referencedColumnName: "id" })
    user: UserEntity;

    @Column({ default: Date.now(), name: "created_at" })
    createdAt: Date;

    @Column({ name: "last_seen_at" })
    lastSeenAt: Date;

    @BeforeInsert()
    generateUUID() {
        this.uuid = uuidv4();
    }

}