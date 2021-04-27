import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class AddColumnImgUrlAtUserTable1589157048584 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE user ADD COLUMN img_url VARCHAR(255)");
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE user DROP COLUMN img_url");
    }

}
