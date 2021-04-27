import {MigrationInterface, QueryRunner, getRepository} from "typeorm";

export class PopulateRoomTypeTable1596412679708 implements MigrationInterface {

    tableName = "room_type";

    roomTypes = [
        {
            "cd_room_type": "PRIVATE",
            "ds_room_type": "Conversa privada",
        },
        {
            "cd_room_type": "GROUP",
            "ds_room_type": "Conversa em grupo",
        }
    ];

    public async up(queryRunner: QueryRunner): Promise<void> {
        let roomTypesInsertString = "";
        for (const [index, country] of this.roomTypes.entries()) {
            roomTypesInsertString += `('${country.cd_room_type}', '${country.ds_room_type}')`
            if (index < this.roomTypes.length - 1) {
                roomTypesInsertString += ",";
            }
        }
        await queryRunner.query(`INSERT INTO ${this.tableName} (cd_room_type, ds_room_type) VALUES ${roomTypesInsertString}`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.clearTable(this.tableName);
    }

}
