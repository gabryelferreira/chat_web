import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class CreateRoomParticipantTable1589157048559 implements MigrationInterface {

    table = new Table({
        name: "room_participant",
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
                name: "is_admin",
                type: "boolean",
                default: false,
            },
            {
                name: "created_at",
                type: "timestamp",
                default: "CURRENT_TIMESTAMP",
                isNullable: false,
            },
            {
                name: "last_seen_at",
                type: "timestamp",
                isNullable: true,
            }
        ],
        foreignKeys: [
            {
                columnNames: ["id_room"],
                referencedTableName: "room",
                referencedColumnNames: ["id"],
                name: "fk_room_participant_id_room"
            },
            {
                columnNames: ["id_user"],
                referencedTableName: "user",
                referencedColumnNames: ["id"],
                name: "fk_room_participant_id_user"
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
