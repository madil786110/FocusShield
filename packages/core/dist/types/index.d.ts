export interface CalendarEvent {
    id: string;
    subscriptionId?: string;
    title?: string;
    subject?: string;
    start: Date;
    end: Date;
    isRecurring: boolean;
    attendeeCount: number;
    organizerHash: string;
    responseStatus: 'accepted' | 'tentative' | 'declined' | 'none' | 'organizer';
}
export interface WeeklyStats {
    weekStart: Date;
    meetingMinutes: number;
    focusPotentialMinutes: number;
    fragmentationScore: number;
    afterHoursMeetings: number;
    topMeetingCosts: MeetingCost[];
}
export interface MeetingCost {
    eventIdHash: string;
    subject?: string;
    totalMinutes: number;
    attendeeCount: number;
    costScore: number;
}
export interface Recommendation {
    id: string;
    type: 'FOCUS_BLOCK' | 'CLEANUP';
    status: 'PENDING' | 'APPLIED' | 'DISMISSED';
    payload: FocusBlockPayload | CleanupPayload;
}
export interface FocusBlockPayload {
    start: Date;
    end: Date;
    reason: string;
}
export interface CleanupPayload {
    eventIdHash: string;
    suggestion: string;
    potentialSavedMinutes: number;
}
export interface UserSettings {
    workDayStart: number;
    workDayEnd: number;
    focusBlockMinMinutes: number;
    timezone: string;
}
//# sourceMappingURL=index.d.ts.map