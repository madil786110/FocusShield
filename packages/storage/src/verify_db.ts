import { createDb } from './db';
import { migrateToLatest } from './migrator';
import { UserRepository } from './repos/user';
import { SyncRepository } from './repos/sync';
import path from 'path';

async function main() {
    console.log('--- DB Verification Start ---');

    // Use a memory DB or a temp file
    const dbPath = path.join(process.cwd(), 'verify_test.db');
    console.log(`Using DB: ${dbPath}`);

    const client = createDb(dbPath);

    try {
        console.log('Running migrations...');
        await migrateToLatest(client);
        console.log('Migrations done.');

        const userRepo = new UserRepository(client.db);
        const syncRepo = new SyncRepository(client.db);

        console.log('Upserting user...');
        await userRepo.upsertUser({
            id: 'mock-user-1',
            tenantId: 'mock-tenant',
            settings: { workDayStart: 9, workDayEnd: 17, focusBlockMinMinutes: 90 }
        });
        console.log('User upserted.');

        const fetchedUser = await userRepo.getUser('mock-user-1');
        console.log('Fetched User:', fetchedUser);

        if (!fetchedUser || fetchedUser.id !== 'mock-user-1') {
            throw new Error('User fetch failed or mismatch');
        }

        console.log('Creating sync run...');
        const runId = await syncRepo.createRun('mock-user-1');
        console.log('Sync Run Created ID:', runId);

        await syncRepo.completeRun(Number(runId), 'SUCCESS', { graphCalls: 5, throttles: 0 });
        console.log('Sync Run Completed.');

        console.log('--- DB Verification Success ---');
    } catch (err) {
        console.error('--- DB Verification Failed ---');
        console.error(err);
        process.exit(1);
    } finally {
        await client.destroy();
    }
}

main();
