import { MigrationInterface, QueryRunner, TableForeignKey, TableColumn } from "typeorm";

export class CreateIdAttachmentFKRoomMessageTable1589157048599 implements MigrationInterface {

    tableName = "room_message";
    columnName = "id_attachment";
    foreignKeyName = "fk_room_message_id_attachment";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn(this.tableName, new TableColumn({
            name: this.columnName,
            type: "integer",
            isNullable: true,
        }))
        await queryRunner.createForeignKey(this.tableName, new TableForeignKey({
            columnNames: [this.columnName],
            referencedTableName: "attachment",
            referencedColumnNames: ["id"],
            name: this.foreignKeyName,
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropForeignKey(this.tableName, this.foreignKeyName);
        await queryRunner.dropColumn(this.tableName, this.columnName);
    }

}