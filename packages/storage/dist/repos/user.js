"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
class UserRepository {
    constructor(db) {
        this.db = db;
    }
    async upsertUser(user) {
        await this.db
            .insertInto('users')
            .values({
            id: user.id,
            tenantId: user.tenantId,
            settingsJson: JSON.stringify(user.settings),
        })
            .onConflict((oc) => oc.column('id').doUpdateSet({
            settingsJson: JSON.stringify(user.settings),
        }))
            .execute();
    }
    async getUser(id) {
        return await this.db
            .selectFrom('users')
            .selectAll()
            .where('id', '=', id)
            .executeTakeFirst();
    }
}
exports.UserRepository = UserRepository;
//# sourceMappingURL=user.js.map