import { Kysely } from 'kysely';
import { Database } from '../types';
export declare class EventRepository {
    private db;
    constructor(db: Kysely<Database>);
    upsertEventMeta(meta: {
        userId: string;
        eventIdHash: string;
        start: Date;
        end: Date;
        isRecurring: boolean;
        attendeeCount: number;
        organizerHash: string;
        responseStatus: string;
    }): Promise<void>;
    getEventsForUser(userId: string, startAfter: Date, endBefore: Date): Promise<{
        id: number;
        userId: string;
        eventIdHash: string;
        start: string;
        end: string;
        isRecurring: number;
        attendeeCount: number;
        organizerHash: string;
        responseStatus: string;
        createdAt: string;
    }[]>;
    deleteUserEvents(userId: string): Promise<void>;
    deleteOldEvents(olderThanDate: Date): Promise<void>;
}
//# sourceMappingURL=event.d.ts.map