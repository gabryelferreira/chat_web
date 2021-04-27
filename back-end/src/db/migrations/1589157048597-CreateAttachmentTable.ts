import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class CreateAttachmentTable1589157048597 implements MigrationInterface {

    table = new Table({
        name: "attachment",
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
                name: "id_attachment_type",
                type: "integer",
                isNullable: false,
            },
            {
                name: "id_user",
                type: "integer",
                isNullable: false,
            },
            {
                name: "url",
                type: "varchar",
                length: "255",
                isNullable: false,
            },
            {
                name: "created_at",
                type: "timestamp",
                default: "CURRENT_TIMESTAMP",
                isNullable: false,
            },
            {
                name: "height",
                type: "integer",
                isNullable: true,
            },
            {
                name: "width",
                type: "integer",
                isNullable: true,
            },
        ],
        foreignKeys: [
            {
                columnNames: ["id_attachment_type"],
                referencedTableName: "attachment",
                referencedColumnNames: ["id"],
                name: "fk_attachment_id_attachment_type"
            },
            {
                columnNames: ["id_user"],
                referencedTableName: "user",
                referencedColumnNames: ["id"],
                name: "fk_attachment_id_user"
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
