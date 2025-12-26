import { Kysely } from 'kysely';
import { Database } from '../types';

export class SyncRepository {
    constructor(private db: Kysely<Database>) { }

    async createRun(userId: string) {
        const result = await this.db.insertInto('sync_runs')
            .values({
                userId,
                startedAt: new Date().toISOString(),
                status: 'RUNNING',
                graphCalls: 0,
                throttles: 0,
                errorSummary: null
            })
            .returning('id')
            .executeTakeFirstOrThrow();
        return result.id;
    }

    async completeRun(id: number, status: 'SUCCESS' | 'FAILED', metrics: { graphCalls: number; throttles: number; error?: string }) {
        await this.db.updateTable('sync_runs')
            .set({
                finishedAt: new Date().toISOString(),
                status,
                graphCalls: metrics.graphCalls,
                throttles: metrics.throttles,
                errorSummary: metrics.error || null
            })
            .where('id', '=', id)
            .execute();
    }
}
