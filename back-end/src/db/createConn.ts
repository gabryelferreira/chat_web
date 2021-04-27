import "reflect-metadata";
import { createConnection } from "typeorm";
import ormConfig from "../config/ormConfig";
import path from 'path';

export async function createConn() {
    const config = ormConfig as any;
    return new Promise<void>((resolve, reject) => {
        createConnection({
            type: config.type,
            database: config.database,
            username: config.username,
            password: config.password,
            host: config.host,
            charset: config.charset,
            entities: [
                path.resolve(__dirname, "..", "entities") + "/*{.ts,.js}"
            ],
            migrationsTableName: "custom_migration",
            migrations: [
                "./migrations/*{.ts,.js}"
            ],
            cli: {
                migrationsDir: "./migrations"
            }
        })
            .then(() => {
                console.log("Successfully connected to database");
                resolve();
            })
            .catch((e) => {
                console.log("Error connection to database", e);
                reject(e);
            });
    })
}