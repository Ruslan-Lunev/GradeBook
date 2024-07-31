"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseRepository = void 0;
const database_1 = require("./database");
class BaseRepository {
    constructor(table) {
        this.table = table;
    }
    GetAll(paginationRequest) {
        return database_1.database.tableAll(this.table);
    }
    GetById(id) {
        return database_1.database.getById(this.table, id);
    }
    Create(entity) {
        return database_1.database.create(this.table, entity);
    }
    Update(entity) {
        return database_1.database.update(this.table, entity);
    }
    Delete(id) {
        return database_1.database.deleteById(this.table, id);
    }
}
exports.BaseRepository = BaseRepository;
//# sourceMappingURL=baseRepository.js.map