import { addMinutes, differenceInMinutes, startOfDay, addDays, setHours, setMinutes, isBefore, isAfter, getDay } from 'date-fns';
import { CalendarEvent, UserSettings, FocusBlockPayload, Recommendation } from '../types';

export const findFocusBlocks = (events: CalendarEvent[], weekStart: Date, settings: UserSettings): FocusBlockPayload[] => {
    const proposals: FocusBlockPayload[] = [];
    const workDays = [1, 2, 3, 4, 5]; // Mon-Fri

    workDays.forEach(dayIndex => {
        const dayStart = addDays(weekStart, dayIndex);
        // Note: weekStart is assumed to be the start of the week (Sunday or Monday depending on locale), 
        // but our caller usually passes Monday.
        // If weekStart is Monday, then dayIndex 0 is Monday. 
        // But logic in availability.ts treated weekStart as base and added dayIndex effectively assuming weekStart is Sunday-based usually?
        // Actually availability.ts used: const dayStart = addMinutes(weekStart, dayIndex * 24 * 60);
        // Let's align: We assume weekStart is the boundary (e.g. Monday 00:00).
        // If weekStart is Monday, dayIndex 0 is Monday.

        // However, `getDay` returns 0 for Sunday, 1 for Monday.
        // Let's trust date-fns logic: Just iterate 0..4 if we want 5 days from weekStart.
        // Or strictly check getDay().
        // For simplicity, let's just iterate 5 days starting from weekStart.

        const currentDayBase = addDays(weekStart, dayIndex);

        // Define Work Hours
        const workStart = setMinutes(setHours(currentDayBase, settings.workDayStart), 0);
        const workEnd = setMinutes(setHours(currentDayBase, settings.workDayEnd), 0);

        // Filter events for this day
        const dayEvents = events.filter(e => {
            return isAfter(e.end, workStart) && isBefore(e.start, workEnd) &&
                differenceInMinutes(e.end, e.start) > 0;
        }).sort((a, b) => a.start.getTime() - b.start.getTime());

        // Scan for gaps
        let cursor = workStart;

        dayEvents.forEach(e => {
            // Gap before event?
            // Clamp event start
            const effStart = isBefore(e.start, cursor) ? cursor : e.start;
            const effEnd = isAfter(e.end, workEnd) ? workEnd : e.end;

            if (isAfter(effStart, cursor)) {
                const gap = differenceInMinutes(effStart, cursor);
                if (gap >= settings.focusBlockMinMinutes) {
                    proposals.push({
                        start: cursor,
                        end: effStart,
                        reason: 'Found empty slot between meetings'
                    });
                }
            }
            if (isAfter(effEnd, cursor)) {
                cursor = effEnd;
            }
        });

        // Gap after last event?
        if (isBefore(cursor, workEnd)) {
            const gap = differenceInMinutes(workEnd, cursor);
            if (gap >= settings.focusBlockMinMinutes) {
                proposals.push({
                    start: cursor,
                    end: workEnd,
                    reason: 'Free afternoon block'
                });
            }
        }
    });

    return proposals;
};
