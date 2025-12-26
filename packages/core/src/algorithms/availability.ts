import { differenceInMinutes, getDay, getHours, startOfDay, addMinutes, isAfter, isBefore } from 'date-fns';
import { CalendarEvent, UserSettings } from '../types';

export const calculateAvailability = (events: CalendarEvent[], weekStart: Date, settings: UserSettings) => {
    // Simple grid: 15min slots for 5 work days (Mon-Fri)
    // 09:00 - 17:00 (8 hours) = 32 slots per day
    const workDays = [1, 2, 3, 4, 5];
    let totalMeetingMinutes = 0;
    let focusPotentialMinutes = 0;
    let afterHoursMeetings = 0;
    let gapCount = 0;
    let gapTotalDuration = 0;

    workDays.forEach(dayIndex => {
        // Filter events for this day
        const dayStart = addMinutes(weekStart, dayIndex * 24 * 60);
        const workStart = addMinutes(dayStart, settings.workDayStart * 60);
        const workEnd = addMinutes(dayStart, settings.workDayEnd * 60);

        const dayEvents = events.filter(e => {
            const d = getDay(e.start);
            // rudimentary day check (ignores timezone edge cases for V1)
            return d === dayIndex;
        }).sort((a, b) => a.start.getTime() - b.start.getTime());

        // Calculate Grid
        // We walk from workStart to workEnd
        let cursor = workStart;

        // Check after hours
        dayEvents.forEach(e => {
            if (isBefore(e.start, workStart) || isAfter(e.end, workEnd)) {
                afterHoursMeetings++;
            }
        });

        // Merge overlapping events for availability calculation
        // ... (simplified for V1: assume no overlaps in fixture or handle simply)

        dayEvents.forEach(e => {
            // Clamp event to work hours for metric calc
            const effStart = isBefore(e.start, cursor) ? cursor : e.start;
            const effEnd = isAfter(e.end, workEnd) ? workEnd : e.end;

            if (isBefore(effStart, effEnd)) {
                // Gap before this event?
                if (isBefore(cursor, effStart)) {
                    const gap = differenceInMinutes(effStart, cursor);
                    if (gap >= settings.focusBlockMinMinutes) {
                        focusPotentialMinutes += gap;
                    } else if (gap > 0) {
                        // Fragmented time
                        gapCount++;
                        gapTotalDuration += gap;
                    }
                }

                const duration = differenceInMinutes(effEnd, effStart);
                totalMeetingMinutes += duration;
                cursor = effEnd; // move cursor to end of this meeting
            }
        });

        // Gap after last event?
        if (isBefore(cursor, workEnd)) {
            const gap = differenceInMinutes(workEnd, cursor);
            if (gap >= settings.focusBlockMinMinutes) {
                focusPotentialMinutes += gap;
            } else {
                gapCount++;
                gapTotalDuration += gap;
            }
        }
    });

    // Score: Lower is better (0 = perfect focus, 100 = shattered)
    // Heuristic: (UnusableGaps / TotalFreeTime) * 100
    const totalFreeTime = focusPotentialMinutes + gapTotalDuration;
    const fragmentationScore = totalFreeTime === 0 ? 0 : Math.round((gapTotalDuration / totalFreeTime) * 100);

    // Calculate Top Costs
    const costs = events.map(e => ({
        eventIdHash: e.id, // Return original ID here, caller handles hashing
        subject: e.title,
        totalMinutes: differenceInMinutes(e.end, e.start),
        attendeeCount: e.attendeeCount || 0,
        costScore: differenceInMinutes(e.end, e.start) * (e.attendeeCount || 1)
    })).sort((a, b) => b.costScore - a.costScore).slice(0, 3);

    return {
        meetingMinutes: totalMeetingMinutes,
        afterHoursMeetings,
        focusPotentialMinutes,
        fragmentationScore,
        topMeetingCosts: costs
    };
};
