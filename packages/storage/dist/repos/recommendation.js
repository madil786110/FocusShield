"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecommendationRepository = void 0;
class RecommendationRepository {
    constructor(db) {
        this.db = db;
    }
    async saveRecommendations(userId, weekStart, recs) {
        if (recs.length === 0)
            return;
        const chunks = recs.map(r => ({
            userId,
            weekStart: weekStart.toISOString(),
            type: r.type,
            payloadJson: JSON.stringify(r.payload),
            status: r.status
        }));
        await this.db.insertInto('recommendations')
            .values(chunks)
            .execute();
    }
    async getPendingRecommendations(userId) {
        return await this.db.selectFrom('recommendations')
            .selectAll()
            .where('userId', '=', userId)
            .where('status', '=', 'PENDING')
            .orderBy('createdAt', 'desc')
            .execute();
    }
    async updateStatus(id, status) {
        await this.db.updateTable('recommendations')
            .set({ status })
            .where('id', '=', id)
            .execute();
    }
}
exports.RecommendationRepository = RecommendationRepository;
//# sourceMappingURL=recommendation.js.map