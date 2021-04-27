import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class CreateRoomType1589157048541 implements MigrationInterface {

    table = new Table({
        name: "room_type",
        columns: [
            {
                name: "id",
                type: "integer",
                isPrimary: true,
                isGenerated: true,
                generationStrategy: "increment",
            },
            {
                name: "cd_room_type",
                type: "varchar",
                length: "15",
                isUnique: true,
                isNullable: false,
            },
            {
                name: "ds_room_type",
                type: "varchar",
                length: "50",
                isNullable: false,
            },
        ]
    })

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.createTable(this.table);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropTable(this.table);
    }

}
