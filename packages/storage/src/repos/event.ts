import { Kysely } from 'kysely';
import { Database } from '../types';

export class EventRepository {
    constructor(private db: Kysely<Database>) { }

    async upsertEventMeta(meta: {
        userId: string;
        eventIdHash: string;
        start: Date;
        end: Date;
        isRecurring: boolean;
        attendeeCount: number;
        organizerHash: string;
        responseStatus: string;
    }) {
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
            .onConflict((oc) =>
                oc.columns(['userId', 'eventIdHash']).doUpdateSet({
                    start: meta.start.toISOString(),
                    end: meta.end.toISOString(),
                    isRecurring: meta.isRecurring ? 1 : 0,
                    attendeeCount: meta.attendeeCount,
                    responseStatus: meta.responseStatus
                })
            )
            .execute();
    }

    async getEventsForUser(userId: string, startAfter: Date, endBefore: Date) {
        return await this.db.selectFrom('event_meta')
            .selectAll()
            .where('userId', '=', userId)
            .where('start', '>=', startAfter.toISOString())
            .where('end', '<=', endBefore.toISOString())
            .execute();
    }

    async deleteUserEvents(userId: string) {
        await this.db.deleteFrom('event_meta').where('userId', '=', userId).execute();
    }

    async deleteOldEvents(olderThanDate: Date) {
        await this.db.deleteFrom('event_meta')
            .where('end', '<', olderThanDate.toISOString())
            .execute();
    }
}
