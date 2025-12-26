export interface CalendarEvent {
    id: string;
    subscriptionId?: string;
    title?: string; // mapping subject to title for ease
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
    subject?: string; // only if user allows or for display in memory
    totalMinutes: number;
    attendeeCount: number;
    costScore: number; // minutes * attendees
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
    suggestion: string; // e.g., "Shorten to 45m"
    potentialSavedMinutes: number;
}

export interface UserSettings {
    workDayStart: number; // Hour 0-23
    workDayEnd: number; // Hour 0-23
    focusBlockMinMinutes: number;
    timezone: string;
}
