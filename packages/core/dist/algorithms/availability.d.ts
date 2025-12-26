import { CalendarEvent, UserSettings } from '../types';
export declare const calculateAvailability: (events: CalendarEvent[], weekStart: Date, settings: UserSettings) => {
    meetingMinutes: number;
    afterHoursMeetings: number;
    focusPotentialMinutes: number;
    fragmentationScore: number;
    topMeetingCosts: {
        eventIdHash: string;
        subject: string | undefined;
        totalMinutes: number;
        attendeeCount: number;
        costScore: number;
    }[];
};
//# sourceMappingURL=availability.d.ts.map