import { MigrationInterface, QueryRunner } from "typeorm";

export class AddColumnTotalMessagesAtRoomTable1589157048610 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE room ADD COLUMN total_messages integer DEFAULT 0");
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE room DROP COLUMN total_messages");
    }

}