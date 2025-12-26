import { Kysely } from 'kysely';
import { Database as DatabaseType } from './types';
export declare class DbClient {
    db: Kysely<DatabaseType>;
    constructor(filePath?: string);
    destroy(): Promise<void>;
}
export declare const createDb: (location?: string) => DbClient;
//# sourceMappingURL=db.d.ts.map