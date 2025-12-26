import { createHash } from 'crypto';

export class Privacy {
    private static readonly SALT = process.env.FOCUSSHIELD_SALT || 'dev-salt-do-not-use-in-prod';

    static hash(value: string): string {
        return createHash('sha256')
            .update(value + this.SALT)
            .digest('hex');
    }

    static hashEmail(email: string): string {
        return this.hash(email.toLowerCase().trim());
    }
}
