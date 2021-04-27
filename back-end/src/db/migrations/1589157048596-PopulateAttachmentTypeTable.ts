import { MigrationInterface, QueryRunner, TableForeignKey } from "typeorm";

export class PopulateAttachmentTypeTable1589157048596 implements MigrationInterface {

    tableName = "attachment_type";

    attachmentTypes = [
        {
            "cd_attachment_type": "IMAGE",
            "ds_attachment_type": "Imagem",
        },
        {
            "cd_attachment_type": "VIDEO",
            "ds_attachment_type": "Vídeo",
        }
    ];

    public async up(queryRunner: QueryRunner): Promise<void> {
        let attachmentTypesInsertString = "";
        for (const [index, country] of this.attachmentTypes.entries()) {
            attachmentTypesInsertString += `('${country.cd_attachment_type}', '${country.ds_attachment_type}')`
            if (index < this.attachmentTypes.length - 1) {
                attachmentTypesInsertString += ",";
            }
        }
        await queryRunner.query(`INSERT INTO ${this.tableName} (cd_attachment_type, ds_attachment_type) VALUES ${attachmentTypesInsertString}`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.clearTable(this.tableName);
    }

}