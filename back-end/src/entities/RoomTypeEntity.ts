import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: "room_type" })
export class RoomTypeEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: "cd_room_type", nullable: false, unique: true })
    cdRoomType: string;

    @Column({ name: "ds_room_type", nullable: false })
    roomType: string;
}