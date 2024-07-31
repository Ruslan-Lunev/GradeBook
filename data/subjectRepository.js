"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubjectScoreRepository = void 0;
const database_1 = require("./database");
const baseRepository_1 = require("./baseRepository");
class SubjectScoreRepository extends baseRepository_1.BaseRepository {
    constructor() {
        super("Subject");
    }
    GetByName(name) {
        var sql = `SELECT * FROM ${this.table} WHERE name = ?;`;
        return database_1.database.get(sql, [name]);
    }
}
exports.SubjectScoreRepository = SubjectScoreRepository;
//# sourceMappingURL=subjectRepository.js.map