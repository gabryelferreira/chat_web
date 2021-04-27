import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class CreateRoomMessageTable1589157048559 implements MigrationInterface {

    table = new Table({
        name: "room_message",
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
                name: "id_room",
                type: "integer",
                isNullable: false,
            },
            {
                name: "id_user",
                type: "integer",
                isNullable: false,
            },
            {
                name: "message",
                type: "varchar",
                length: "1000",
                isNullable: false,
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
            },
        ],
        foreignKeys: [
            {
                columnNames: ["id_room"],
                referencedTableName: "room",
                referencedColumnNames: ["id"],
                name: "fk_room_message_id_room"
            },
            {
                columnNames: ["id_user"],
                referencedTableName: "user",
                referencedColumnNames: ["id"],
                name: "fk_room_message_id_user"
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
