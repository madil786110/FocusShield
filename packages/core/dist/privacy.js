"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Privacy = void 0;
const crypto_1 = require("crypto");
class Privacy {
    static hash(value) {
        return (0, crypto_1.createHash)('sha256')
            .update(value + this.SALT)
            .digest('hex');
    }
    static hashEmail(email) {
        return this.hash(email.toLowerCase().trim());
    }
}
exports.Privacy = Privacy;
Privacy.SALT = process.env.FOCUSSHIELD_SALT || 'dev-salt-do-not-use-in-prod';
//# sourceMappingURL=privacy.js.map