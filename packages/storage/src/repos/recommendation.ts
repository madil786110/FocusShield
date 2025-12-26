import { Kysely } from 'kysely';
import { Database } from '../types';

export class RecommendationRepository {
    constructor(private db: Kysely<Database>) { }

    async saveRecommendations(
        userId: string,
        weekStart: Date,
        recs: { type: 'FOCUS_BLOCK' | 'CLEANUP'; payload: any; status: 'PENDING' | 'APPLIED' | 'DISMISSED' }[]
    ) {
        if (recs.length === 0) return;

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

    async getPendingRecommendations(userId: string) {
        return await this.db.selectFrom('recommendations')
            .selectAll()
            .where('userId', '=', userId)
            .where('status', '=', 'PENDING')
            .orderBy('createdAt', 'desc')
            .execute();
    }

    async updateStatus(id: number, status: 'APPLIED' | 'DISMISSED') {
        await this.db.updateTable('recommendations')
            .set({ status })
            .where('id', '=', id)
            .execute();
    }
}
