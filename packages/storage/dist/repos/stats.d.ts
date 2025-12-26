import { Kysely } from 'kysely';
import { Database } from '../types';
export declare class StatsRepository {
    private db;
    constructor(db: Kysely<Database>);
    saveWeeklyStats(stats: {
        userId: string;
        weekStart: Date;
        meetingMinutes: number;
        focusPotentialMinutes: number;
        fragmentationScore: number;
        afterHoursMeetings: number;
        topMeetingCosts: any[];
    }): Promise<void>;
    getLatestStats(userId: string): Promise<{
        id: number;
        userId: string;
        weekStart: string;
        meetingMinutes: number;
        focusPotentialMinutes: number;
        fragmentationScore: number;
        afterHoursMeetings: number;
        topMeetingCostsJson: any[];
        createdAt: string;
    } | undefined>;
}
//# sourceMappingURL=stats.d.ts.map