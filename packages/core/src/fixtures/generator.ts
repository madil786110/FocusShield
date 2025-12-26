import { addDays, addHours, addMinutes, setHours, setMinutes, startOfWeek } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';
import { CalendarEvent } from '../types';

interface FixtureOptions {
    weekStart: Date;
    seed?: string; // For deterministic generation (future enhancement: actually use seed)
}

export const generateWeek = (type: 'LIGHT' | 'BUSY' | 'FRAGMENTED', options: FixtureOptions): CalendarEvent[] => {
    const events: CalendarEvent[] = [];
    const { weekStart } = options;

    // Helper to create event
    const createEvent = (dayOffset: number, startHour: number, durationMinutes: number, attendees: number = 2): CalendarEvent => {
        const start = addMinutes(addHours(addDays(weekStart, dayOffset), startHour), 0); // precise start
        return {
            id: uuidv4(),
            subject: `Mock Meeting ${events.length + 1}`,
            start: start,
            end: addMinutes(start, durationMinutes),
            isRecurring: false,
            attendeeCount: attendees,
            organizerHash: 'mock-hash',
            responseStatus: 'accepted'
        };
    };

    // 0=Sunday, 1=Monday, ... 5=Friday
    const workDays = [1, 2, 3, 4, 5];

    workDays.forEach(day => {
        if (type === 'LIGHT') {
            // 1 meeting a day
            events.push(createEvent(day, 10, 30, 3));
        } else if (type === 'BUSY') {
            // Back to back mornings
            events.push(createEvent(day, 9, 60, 5));
            events.push(createEvent(day, 10, 60, 5));
            events.push(createEvent(day, 11, 60, 5));
            events.push(createEvent(day, 14, 30, 2));
            events.push(createEvent(day, 16, 30, 2));
        } else if (type === 'FRAGMENTED') {
            // Swiss cheese
            events.push(createEvent(day, 9, 30, 4));
            // 30 min gap
            events.push(createEvent(day, 10, 30, 4));
            // 45 min gap
            events.push(createEvent(day, 11, 15, 8)); // Standup
            events.push(createEvent(day, 13, 30, 2));
            events.push(createEvent(day, 15, 45, 3));
        }
    });

    return events;
};
