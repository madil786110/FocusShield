"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventRepository = void 0;
class EventRepository {
    constructor(db) {
        this.db = db;
    }
    async upsertEventMeta(meta) {
        await this.db
            .insertInto('event_meta')
            .values({
            userId: meta.userId,
            eventIdHash: meta.eventIdHash,
            start: meta.start.toISOString(),
            end: meta.end.toISOString(),
            isRecurring: meta.isRecurring ? 1 : 0,
            attendeeCount: meta.attendeeCount,
            organizerHash: meta.organizerHash,
            responseStatus: meta.responseStatus
        })
            .onConflict((oc) => oc.columns(['userId', 'eventIdHash']).doUpdateSet({
            start: meta.start.toISOString(),
            end: meta.end.toISOString(),
            isRecurring: meta.isRecurring ? 1 : 0,
            attendeeCount: meta.attendeeCount,
            responseStatus: meta.responseStatus
        }))
            .execute();
    }
    async getEventsForUser(userId, startAfter, endBefore) {
        return await this.db.selectFrom('event_meta')
            .selectAll()
            .where('userId', '=', userId)
            .where('start', '>=', startAfter.toISOString())
            .where('end', '<=', endBefore.toISOString())
            .execute();
    }
    async deleteUserEvents(userId) {
        await this.db.deleteFrom('event_meta').where('userId', '=', userId).execute();
    }
    async deleteOldEvents(olderThanDate) {
        await this.db.deleteFrom('event_meta')
            .where('end', '<', olderThanDate.toISOString())
            .execute();
    }
}
exports.EventRepository = EventRepository;
//# sourceMappingURL=event.js.map