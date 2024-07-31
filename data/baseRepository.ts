import { database } from './database'
import { PaginationRequest } from './paginationRequest'

export class BaseRepository<T> {
    table: string
    constructor(table: string) {
        this.table = table
    }

    GetAll(paginationRequest?: PaginationRequest): Promise<T[]> {
        return database.tableAll<T>(this.table)
    }

    GetById(id: number): Promise<T> {
        return database.getById(this.table, id)
    }

    Create(entity: T) {
        return database.create(this.table, entity)
    }

    Update(entity: T) {
        return database.update(this.table, entity)
    }

    Delete(id: number) {
        return database.deleteById(this.table, id)
    }
}