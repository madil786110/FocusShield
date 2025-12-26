"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SyncRepository = void 0;
class SyncRepository {
    constructor(db) {
        this.db = db;
    }
    async createRun(userId) {
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
    async completeRun(id, status, metrics) {
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
exports.SyncRepository = SyncRepository;
//# sourceMappingURL=sync.js.map