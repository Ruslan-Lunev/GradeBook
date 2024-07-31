import { database } from './database'
import { BaseRepository } from './baseRepository'
import { User } from './model/user'

export class UserRepository extends BaseRepository<User> {
    constructor() {
        super("User")
    }

    GetByEmail(email: string): Promise<User> {
        var sql = `SELECT * FROM ${this.table} WHERE email = ?;`
        return database.get<User>(sql, [email])
    }
}