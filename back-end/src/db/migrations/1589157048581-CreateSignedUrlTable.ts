import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class CreateSignedUrlTable1589157048581 implements MigrationInterface {

    table = new Table({
        name: "signed_url",
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
                columnNames: ["id_user"],
                referencedTableName: "user",
                referencedColumnNames: ["id"],
                name: "fk_signed_url_id_user"
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
