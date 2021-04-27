import { Entity, PrimaryGeneratedColumn, Column, OneToMany, BeforeInsert, OneToOne, JoinColumn } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import BCryptHelper from '../utils/helpers/BCryptHelper';
import { RoomTypeEntity } from './RoomTypeEntity';
import { RoomParticipantEntity } from './RoomParticipantEntity';

@Entity({ name: "room" })
export class RoomEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false, unique: true })
    uuid: string;

    @Column()
    name: string;

    @Column({ name: "id_room_type" })
    idRoomType: number;

    @Column({ name: "img_url" })
    imgUrl: string;

    @Column({ name: "total_messages", default: 0 })
    totalMessages: number;

    @OneToOne(() => RoomTypeEntity, { nullable: false })
    @JoinColumn({ name: "id_room_type", referencedColumnName: "id" })
    roomType: RoomTypeEntity;

    @OneToMany(() => RoomParticipantEntity, roomParticipant => roomParticipant.room)
    participants: RoomParticipantEntity[];

    @Column({ default: Date.now(), name: "created_at" })
    createdAt: Date;

    @Column({ default: Date.now(), name: "updated_at" })
    updatedAt: Date;

    @BeforeInsert()
    generateUUID() {
        this.uuid = uuidv4();
    }

}