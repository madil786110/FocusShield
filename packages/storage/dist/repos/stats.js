"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatsRepository = void 0;
class StatsRepository {
    constructor(db) {
        this.db = db;
    }
    async saveWeeklyStats(stats) {
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
    async getLatestStats(userId) {
        return await this.db.selectFrom('weekly_stats')
            .selectAll()
            .where('userId', '=', userId)
            .orderBy('weekStart', 'desc')
            .limit(1)
            .executeTakeFirst();
    }
}
exports.StatsRepository = StatsRepository;
//# sourceMappingURL=stats.js.map