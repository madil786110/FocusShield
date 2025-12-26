import { Kysely } from 'kysely';
import { Database } from '../types';
export declare class RecommendationRepository {
    private db;
    constructor(db: Kysely<Database>);
    saveRecommendations(userId: string, weekStart: Date, recs: {
        type: 'FOCUS_BLOCK' | 'CLEANUP';
        payload: any;
        status: 'PENDING' | 'APPLIED' | 'DISMISSED';
    }[]): Promise<void>;
    getPendingRecommendations(userId: string): Promise<{
        id: number;
        userId: string;
        weekStart: string;
        type: "FOCUS_BLOCK" | "CLEANUP";
        payloadJson: any;
        status: "PENDING" | "APPLIED" | "DISMISSED";
        createdAt: string;
    }[]>;
    updateStatus(id: number, status: 'APPLIED' | 'DISMISSED'): Promise<void>;
}
//# sourceMappingURL=recommendation.d.ts.map