import { database } from './database'
import { BaseRepository } from './baseRepository'
import { SubjectScore, StudentScore, Score } from './model/studentScore'
import { Subject } from './model/subject'
import { PaginationRequest } from './paginationRequest'
import { get } from 'http'

export class SubjectScoreRepository extends BaseRepository<Subject> {
    constructor() {
        super("Subject")
    }

    GetByName(name: string): Promise<Subject> {
        var sql = `SELECT * FROM ${this.table} WHERE name = ?;`
        return database.get<Subject>(sql, [name])
    }
}