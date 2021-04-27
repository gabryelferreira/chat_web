import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class AddColumnImgUrlAtRoomTable1589157048589 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE room ADD COLUMN img_url VARCHAR(255)");
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE room DROP COLUMN img_url");
    }

}
