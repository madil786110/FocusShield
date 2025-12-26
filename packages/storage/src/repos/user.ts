import { Kysely } from 'kysely';
import { Database } from '../types';

export class UserRepository {
    constructor(private db: Kysely<Database>) { }

    async upsertUser(user: { id: string; tenantId: string; settings: any }) {
        await this.db
            .insertInto('users')
            .values({
                id: user.id,
                tenantId: user.tenantId,
                settingsJson: JSON.stringify(user.settings),
            })
            .onConflict((oc) =>
                oc.column('id').doUpdateSet({
                    settingsJson: JSON.stringify(user.settings),
                })
            )
            .execute();
    }

    async getUser(id: string) {
        return await this.db
            .selectFrom('users')
            .selectAll()
            .where('id', '=', id)
            .executeTakeFirst();
    }
}
