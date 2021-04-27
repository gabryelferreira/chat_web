import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class CreateRoomTable1589157048559 implements MigrationInterface {

    table = new Table({
        name: "room",
        columns: [
            {
                name: "id",
                type: "integer",
                isPrimary: true,
                isGenerated: true,
                generationStrategy: "increment",
            },
            {
                name: "uuid",
                type: "varchar",
                length: "100",
                isUnique: true,
                isNullable: false,
            },
            {
                name: "id_room_type",
                type: "integer",
                isNullable: false,
            },
            {
                name: "name",
                type: "varchar",
                length: "100",
                isNullable: true,
            },
            {
                name: "created_at",
                type: "timestamp",
                default: "CURRENT_TIMESTAMP",
                isNullable: false,
            },
            {
                name: "updated_at",
                type: "timestamp",
                default: "CURRENT_TIMESTAMP",
                isNullable: false,
            }
        ],
        foreignKeys: [
            {
                columnNames: ["id_room_type"],
                referencedTableName: "room_type",
                referencedColumnNames: ["id"],
                name: "fk_room_id_room_type"
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
