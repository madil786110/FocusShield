import { ColumnType, Generated, JSONColumnType } from 'kysely';
export interface UserTable {
    id: string;
    tenantId: string;
    createdAt: ColumnType<string, string | undefined, never>;
    settingsJson: JSONColumnType<{
        workDayStart: number;
        workDayEnd: number;
        focusBlockMinMinutes: number;
    }>;
}
export interface EventMetaTable {
    id: Generated<number>;
    userId: string;
    eventIdHash: string;
    start: ColumnType<string, string, string>;
    end: ColumnType<string, string, string>;
    isRecurring: number;
    attendeeCount: number;
    organizerHash: string;
    responseStatus: string;
    createdAt: ColumnType<string, string | undefined, never>;
}
export interface WeeklyStatsTable {
    id: Generated<number>;
    userId: string;
    weekStart: ColumnType<string, string, string>;
    meetingMinutes: number;
    focusPotentialMinutes: number;
    fragmentationScore: number;
    afterHoursMeetings: number;
    topMeetingCostsJson: JSONColumnType<any[]>;
    createdAt: ColumnType<string, string | undefined, never>;
}
export interface RecommendationTable {
    id: Generated<number>;
    userId: string;
    weekStart: ColumnType<string, string, string>;
    type: 'FOCUS_BLOCK' | 'CLEANUP';
    payloadJson: JSONColumnType<any>;
    status: 'PENDING' | 'APPLIED' | 'DISMISSED';
    createdAt: ColumnType<string, string | undefined, never>;
}
export interface SyncRunTable {
    id: Generated<number>;
    userId: string;
    startedAt: ColumnType<string, string, string>;
    finishedAt: ColumnType<string, string | undefined, string>;
    status: 'RUNNING' | 'SUCCESS' | 'FAILED';
    graphCalls: number;
    throttles: number;
    errorSummary: string | null;
}
export interface Database {
    users: UserTable;
    event_meta: EventMetaTable;
    weekly_stats: WeeklyStatsTable;
    recommendations: RecommendationTable;
    sync_runs: SyncRunTable;
}
//# sourceMappingURL=types.d.ts.map