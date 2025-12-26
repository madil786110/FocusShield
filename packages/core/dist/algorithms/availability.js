"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateAvailability = void 0;
const date_fns_1 = require("date-fns");
const calculateAvailability = (events, weekStart, settings) => {
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
        const dayStart = (0, date_fns_1.addMinutes)(weekStart, dayIndex * 24 * 60);
        const workStart = (0, date_fns_1.addMinutes)(dayStart, settings.workDayStart * 60);
        const workEnd = (0, date_fns_1.addMinutes)(dayStart, settings.workDayEnd * 60);
        const dayEvents = events.filter(e => {
            const d = (0, date_fns_1.getDay)(e.start);
            // rudimentary day check (ignores timezone edge cases for V1)
            return d === dayIndex;
        }).sort((a, b) => a.start.getTime() - b.start.getTime());
        // Calculate Grid
        // We walk from workStart to workEnd
        let cursor = workStart;
        // Check after hours
        dayEvents.forEach(e => {
            if ((0, date_fns_1.isBefore)(e.start, workStart) || (0, date_fns_1.isAfter)(e.end, workEnd)) {
                afterHoursMeetings++;
            }
        });
        // Merge overlapping events for availability calculation
        // ... (simplified for V1: assume no overlaps in fixture or handle simply)
        dayEvents.forEach(e => {
            // Clamp event to work hours for metric calc
            const effStart = (0, date_fns_1.isBefore)(e.start, cursor) ? cursor : e.start;
            const effEnd = (0, date_fns_1.isAfter)(e.end, workEnd) ? workEnd : e.end;
            if ((0, date_fns_1.isBefore)(effStart, effEnd)) {
                // Gap before this event?
                if ((0, date_fns_1.isBefore)(cursor, effStart)) {
                    const gap = (0, date_fns_1.differenceInMinutes)(effStart, cursor);
                    if (gap >= settings.focusBlockMinMinutes) {
                        focusPotentialMinutes += gap;
                    }
                    else if (gap > 0) {
                        // Fragmented time
                        gapCount++;
                        gapTotalDuration += gap;
                    }
                }
                const duration = (0, date_fns_1.differenceInMinutes)(effEnd, effStart);
                totalMeetingMinutes += duration;
                cursor = effEnd; // move cursor to end of this meeting
            }
        });
        // Gap after last event?
        if ((0, date_fns_1.isBefore)(cursor, workEnd)) {
            const gap = (0, date_fns_1.differenceInMinutes)(workEnd, cursor);
            if (gap >= settings.focusBlockMinMinutes) {
                focusPotentialMinutes += gap;
            }
            else {
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
        totalMinutes: (0, date_fns_1.differenceInMinutes)(e.end, e.start),
        attendeeCount: e.attendeeCount || 0,
        costScore: (0, date_fns_1.differenceInMinutes)(e.end, e.start) * (e.attendeeCount || 1)
    })).sort((a, b) => b.costScore - a.costScore).slice(0, 3);
    return {
        meetingMinutes: totalMeetingMinutes,
        afterHoursMeetings,
        focusPotentialMinutes,
        fragmentationScore,
        topMeetingCosts: costs
    };
};
exports.calculateAvailability = calculateAvailability;
//# sourceMappingURL=availability.js.map