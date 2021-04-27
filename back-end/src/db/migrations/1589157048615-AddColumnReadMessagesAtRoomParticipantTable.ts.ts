import { MigrationInterface, QueryRunner } from "typeorm";

export class AddColumnReadMessagesAtRoomParticipantTable1589157048615 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE room_participant ADD COLUMN read_messages integer DEFAULT 0");
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE room_participant DROP COLUMN read_messages");
    }

}