import { Kysely } from 'kysely';
import { Database } from '../types';
export declare class UserRepository {
    private db;
    constructor(db: Kysely<Database>);
    upsertUser(user: {
        id: string;
        tenantId: string;
        settings: any;
    }): Promise<void>;
    getUser(id: string): Promise<{
        id: string;
        createdAt: string;
        tenantId: string;
        settingsJson: {
            workDayStart: number;
            workDayEnd: number;
            focusBlockMinMinutes: number;
        };
    } | undefined>;
}
//# sourceMappingURL=user.d.ts.map