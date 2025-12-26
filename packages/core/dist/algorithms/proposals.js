"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findFocusBlocks = void 0;
const date_fns_1 = require("date-fns");
const findFocusBlocks = (events, weekStart, settings) => {
    const proposals = [];
    const workDays = [1, 2, 3, 4, 5]; // Mon-Fri
    workDays.forEach(dayIndex => {
        const dayStart = (0, date_fns_1.addDays)(weekStart, dayIndex);
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
        const currentDayBase = (0, date_fns_1.addDays)(weekStart, dayIndex);
        // Define Work Hours
        const workStart = (0, date_fns_1.setMinutes)((0, date_fns_1.setHours)(currentDayBase, settings.workDayStart), 0);
        const workEnd = (0, date_fns_1.setMinutes)((0, date_fns_1.setHours)(currentDayBase, settings.workDayEnd), 0);
        // Filter events for this day
        const dayEvents = events.filter(e => {
            return (0, date_fns_1.isAfter)(e.end, workStart) && (0, date_fns_1.isBefore)(e.start, workEnd) &&
                (0, date_fns_1.differenceInMinutes)(e.end, e.start) > 0;
        }).sort((a, b) => a.start.getTime() - b.start.getTime());
        // Scan for gaps
        let cursor = workStart;
        dayEvents.forEach(e => {
            // Gap before event?
            // Clamp event start
            const effStart = (0, date_fns_1.isBefore)(e.start, cursor) ? cursor : e.start;
            const effEnd = (0, date_fns_1.isAfter)(e.end, workEnd) ? workEnd : e.end;
            if ((0, date_fns_1.isAfter)(effStart, cursor)) {
                const gap = (0, date_fns_1.differenceInMinutes)(effStart, cursor);
                if (gap >= settings.focusBlockMinMinutes) {
                    proposals.push({
                        start: cursor,
                        end: effStart,
                        reason: 'Found empty slot between meetings'
                    });
                }
            }
            if ((0, date_fns_1.isAfter)(effEnd, cursor)) {
                cursor = effEnd;
            }
        });
        // Gap after last event?
        if ((0, date_fns_1.isBefore)(cursor, workEnd)) {
            const gap = (0, date_fns_1.differenceInMinutes)(workEnd, cursor);
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
exports.findFocusBlocks = findFocusBlocks;
//# sourceMappingURL=proposals.js.map