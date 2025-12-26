import { Kysely, SqliteDialect } from 'kysely';
import Database from 'better-sqlite3';
import { Database as DatabaseType } from './types';
import path from 'path';

export class DbClient {
    public db: Kysely<DatabaseType>;

    constructor(filePath: string = 'focusshield.db') {
        const dialect = new SqliteDialect({
            database: new Database(filePath),
        });

        this.db = new Kysely<DatabaseType>({
            dialect,
        });
    }

    async destroy() {
        await this.db.destroy();
    }
}

// Singleton for easy access in V1
export const createDb = (location?: string) => new DbClient(location);
