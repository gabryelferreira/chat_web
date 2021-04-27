/**
 * It's recommended to create a .env file.
 */

export = {
    type: "mysql",
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    username: process.env.DB_USER,
    port: process.env.DB_PORT,
    host: process.env.DB_HOST,
    charset: "utf8mb4",
    entities: [
        "lib/entities/*{.ts,.js}"
    ],
    migrationsTableName: "custom_migration",
    migrations: [
        "lib/db/migrations/*{.ts,.js}"
    ],
    cli: {
        migrationsDir: "lib/db/migrations"
    }
}