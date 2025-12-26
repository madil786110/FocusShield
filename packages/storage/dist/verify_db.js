"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("./db");
const migrator_1 = require("./migrator");
const user_1 = require("./repos/user");
const sync_1 = require("./repos/sync");
const path_1 = __importDefault(require("path"));
async function main() {
    console.log('--- DB Verification Start ---');
    // Use a memory DB or a temp file
    const dbPath = path_1.default.join(process.cwd(), 'verify_test.db');
    console.log(`Using DB: ${dbPath}`);
    const client = (0, db_1.createDb)(dbPath);
    try {
        console.log('Running migrations...');
        await (0, migrator_1.migrateToLatest)(client);
        console.log('Migrations done.');
        const userRepo = new user_1.UserRepository(client.db);
        const syncRepo = new sync_1.SyncRepository(client.db);
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
    }
    catch (err) {
        console.error('--- DB Verification Failed ---');
        console.error(err);
        process.exit(1);
    }
    finally {
        await client.destroy();
    }
}
main();
//# sourceMappingURL=verify_db.js.map