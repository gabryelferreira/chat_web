import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: "attachment_type" })
export class AttachmentTypeEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: "cd_attachment_type", nullable: false, unique: true })
    cdAttachmentType: string;

    @Column({ name: "ds_attachment_type", nullable: false })
    attachmentType: string;
}