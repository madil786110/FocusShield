import { Kysely, sql } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
    await db.schema
        .createTable('users')
        .addColumn('id', 'text', (col) => col.primaryKey())
        .addColumn('tenantId', 'text', (col) => col.notNull())
        .addColumn('createdAt', 'text', (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())
        .addColumn('settingsJson', 'text', (col) => col.notNull())
        .execute();

    await db.schema
        .createTable('event_meta')
        .addColumn('id', 'integer', (col) => col.primaryKey().autoIncrement())
        .addColumn('userId', 'text', (col) => col.references('users.id').onDelete('cascade').notNull())
        .addColumn('eventIdHash', 'text', (col) => col.notNull())
        .addColumn('start', 'text', (col) => col.notNull())
        .addColumn('end', 'text', (col) => col.notNull())
        .addColumn('isRecurring', 'integer', (col) => col.notNull()) // 0 or 1
        .addColumn('attendeeCount', 'integer', (col) => col.notNull())
        .addColumn('organizerHash', 'text', (col) => col.notNull())
        .addColumn('responseStatus', 'text', (col) => col.notNull())
        .addColumn('createdAt', 'text', (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())
        .addUniqueConstraint('event_meta_unique_idx', ['userId', 'eventIdHash'])
        .execute();

    await db.schema
        .createTable('weekly_stats')
        .addColumn('id', 'integer', (col) => col.primaryKey().autoIncrement())
        .addColumn('userId', 'text', (col) => col.references('users.id').onDelete('cascade').notNull())
        .addColumn('weekStart', 'text', (col) => col.notNull())
        .addColumn('meetingMinutes', 'integer', (col) => col.notNull())
        .addColumn('focusPotentialMinutes', 'integer', (col) => col.notNull())
        .addColumn('fragmentationScore', 'real', (col) => col.notNull())
        .addColumn('afterHoursMeetings', 'integer', (col) => col.notNull())
        .addColumn('topMeetingCostsJson', 'text', (col) => col.notNull())
        .addColumn('createdAt', 'text', (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())
        .execute();

    await db.schema
        .createTable('recommendations')
        .addColumn('id', 'integer', (col) => col.primaryKey().autoIncrement())
        .addColumn('userId', 'text', (col) => col.references('users.id').onDelete('cascade').notNull())
        .addColumn('weekStart', 'text', (col) => col.notNull())
        .addColumn('type', 'text', (col) => col.notNull())
        .addColumn('payloadJson', 'text', (col) => col.notNull())
        .addColumn('status', 'text', (col) => col.notNull())
        .addColumn('createdAt', 'text', (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())
        .execute();

    await db.schema
        .createTable('sync_runs')
        .addColumn('id', 'integer', (col) => col.primaryKey().autoIncrement())
        .addColumn('userId', 'text', (col) => col.references('users.id').onDelete('cascade').notNull())
        .addColumn('startedAt', 'text', (col) => col.notNull())
        .addColumn('finishedAt', 'text')
        .addColumn('status', 'text', (col) => col.notNull())
        .addColumn('graphCalls', 'integer', (col) => col.notNull())
        .addColumn('throttles', 'integer', (col) => col.notNull())
        .addColumn('errorSummary', 'text')
        .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
    await db.schema.dropTable('sync_runs').execute();
    await db.schema.dropTable('recommendations').execute();
    await db.schema.dropTable('weekly_stats').execute();
    await db.schema.dropTable('event_meta').execute();
    await db.schema.dropTable('users').execute();
}
