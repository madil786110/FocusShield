"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateWeek = void 0;
const date_fns_1 = require("date-fns");
const uuid_1 = require("uuid");
const generateWeek = (type, options) => {
    const events = [];
    const { weekStart } = options;
    // Helper to create event
    const createEvent = (dayOffset, startHour, durationMinutes, attendees = 2) => {
        const start = (0, date_fns_1.addMinutes)((0, date_fns_1.addHours)((0, date_fns_1.addDays)(weekStart, dayOffset), startHour), 0); // precise start
        return {
            id: (0, uuid_1.v4)(),
            subject: `Mock Meeting ${events.length + 1}`,
            start: start,
            end: (0, date_fns_1.addMinutes)(start, durationMinutes),
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
        }
        else if (type === 'BUSY') {
            // Back to back mornings
            events.push(createEvent(day, 9, 60, 5));
            events.push(createEvent(day, 10, 60, 5));
            events.push(createEvent(day, 11, 60, 5));
            events.push(createEvent(day, 14, 30, 2));
            events.push(createEvent(day, 16, 30, 2));
        }
        else if (type === 'FRAGMENTED') {
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
exports.generateWeek = generateWeek;
//# sourceMappingURL=generator.js.map