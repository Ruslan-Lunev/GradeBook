"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const database_1 = require("./database");
const baseRepository_1 = require("./baseRepository");
class UserRepository extends baseRepository_1.BaseRepository {
    constructor() {
        super("User");
    }
    GetByEmail(email) {
        var sql = `SELECT * FROM ${this.table} WHERE email = ?;`;
        return database_1.database.get(sql, [email]);
    }
}
exports.UserRepository = UserRepository;
//# sourceMappingURL=userRepository.js.map