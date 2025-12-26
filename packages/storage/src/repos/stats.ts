import { Kysely } from 'kysely';
import { Database } from '../types';

export class StatsRepository {
    constructor(private db: Kysely<Database>) { }

    async saveWeeklyStats(stats: {
        userId: string;
        weekStart: Date;
        meetingMinutes: number;
        focusPotentialMinutes: number;
        fragmentationScore: number;
        afterHoursMeetings: number;
        topMeetingCosts: any[];
    }) {
        await this.db.insertInto('weekly_stats')
            .values({
                userId: stats.userId,
                weekStart: stats.weekStart.toISOString(),
                meetingMinutes: stats.meetingMinutes,
                focusPotentialMinutes: stats.focusPotentialMinutes,
                fragmentationScore: stats.fragmentationScore,
                afterHoursMeetings: stats.afterHoursMeetings,
                topMeetingCostsJson: JSON.stringify(stats.topMeetingCosts)
            })
            .execute();
    }

    async getLatestStats(userId: string) {
        return await this.db.selectFrom('weekly_stats')
            .selectAll()
            .where('userId', '=', userId)
            .orderBy('weekStart', 'desc')
            .limit(1)
            .executeTakeFirst();
    }
}
