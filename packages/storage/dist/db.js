"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDb = exports.DbClient = void 0;
const kysely_1 = require("kysely");
const better_sqlite3_1 = __importDefault(require("better-sqlite3"));
class DbClient {
    constructor(filePath = 'focusshield.db') {
        const dialect = new kysely_1.SqliteDialect({
            database: new better_sqlite3_1.default(filePath),
        });
        this.db = new kysely_1.Kysely({
            dialect,
        });
    }
    async destroy() {
        await this.db.destroy();
    }
}
exports.DbClient = DbClient;
// Singleton for easy access in V1
const createDb = (location) => new DbClient(location);
exports.createDb = createDb;
//# sourceMappingURL=db.js.map