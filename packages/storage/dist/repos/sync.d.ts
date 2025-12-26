import { Kysely } from 'kysely';
import { Database } from '../types';
export declare class SyncRepository {
    private db;
    constructor(db: Kysely<Database>);
    createRun(userId: string): Promise<number>;
    completeRun(id: number, status: 'SUCCESS' | 'FAILED', metrics: {
        graphCalls: number;
        throttles: number;
        error?: string;
    }): Promise<void>;
}
//# sourceMappingURL=sync.d.ts.map