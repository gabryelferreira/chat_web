import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class CreateAttachmentTypeTable1589157048595 implements MigrationInterface {

    table = new Table({
        name: "attachment_type",
        columns: [
            {
                name: "id",
                type: "integer",
                isPrimary: true,
                isGenerated: true,
                generationStrategy: "increment",
            },
            {
                name: "cd_attachment_type",
                type: "varchar",
                length: "15",
                isUnique: true,
                isNullable: false,
            },
            {
                name: "ds_attachment_type",
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
