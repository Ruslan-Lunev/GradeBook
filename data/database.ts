import { escape } from 'querystring'
import { Database } from 'sqlite3'
import { PaginationRequest } from './paginationRequest'

/**
 * Wrapper around sqlite3.Database to provide promises.
 */
export class SqliteDb {
    db: Database
	constructor() {
		this.db = new Database(':memory:', err => {
			if (err) return console.error(err.message)
			else this.init()
		})
	}

	/**
	 * Creates tables and fills them with some initial data.
	 */
	init() {
		console.log('Connected to the in-memory SQlite database.')
		this.db.serialize(() => {
			this.db.run(SQL_SUBJECT_CREATE)
			this.db.run(SQL_SUBJECT_FILL)
			this.db.run(SQL_STUDENT_CREATE)
			this.db.run(SQL_STUDENT_FILL)
			this.db.run(SQL_SCORE_CREATE)
			this.db.run(SQL_SCORE_FILL)
			this.db.run(SQL_USER_CREATE)
		})
	}

	run(sql: string, params = []) {
		return new Promise<number>((resolve, reject) => {
			this.db.run(sql, params, function (err) {
				if (err) {
					console.log('Error running sql ' + sql)
					console.log(err)
					reject(err)
				} else {
					resolve(this.lastID)
				}
			})
		})
	}

	all<T>(sql: string, params: any): Promise<T[]> {
		return new Promise<T[]>((resolve, reject) => {
			this.db.all<T>(sql, params, function (err, rows) {
				if (err) {
					console.log('Error running sql ' + sql)
					console.log(err)
					reject(err)
				} else {
					resolve(rows)
				}
			})
		})
	}

	tableAll<T>(table: string, paginationRequest?: PaginationRequest): Promise<T[]> {
		let args = []
		var sql = `SELECT * FROM ${table}`

		if (paginationRequest) {
			sql += " ? OFFSET ?"
			args = [paginationRequest.pageSize, paginationRequest.offset()]
		}
		return this.all(sql, args)
	}

	get<T>(sql: string, params: any): Promise<T> {
		return new Promise<T>((resolve, reject) => {
			this.db.get<T>(sql, params, function (err, row) {
				if (err) {
					console.log('Error running sql ' + sql)
					console.log(err)
					reject(err)
				} else {
					resolve(row)
				}
			})
		})
	}

	getById<T>(table: string, id: number): Promise<T> {
		return this.get<T>(`SELECT * FROM ${table} WHERE Id = ?`, [id])
	}

	deleteById(table: string, id: number) {
		return this.run(`DELETE FROM ${table} WHERE id = ?`, [id])
	}

	update<T>(table: string, item: T) {
		let pairs: string = '';
		let id: number = undefined;

		for (let [key, value] of Object.entries(item)) {
			if (key.toLowerCase() === 'id') {
				id = value
				continue
			}

			if (pairs) pairs += ", "
			pairs += `'${key}' = '${escape(value)}'`
		}

		if (id === undefined)
			throw new Error('Entity must have an id')

		let sql = `UPDATE ${table} SET ${pairs} WHERE id = ?`
		return this.run(sql, [id])
	}

	create<T>(table: string, item: T) {
		let columns: string = '';
		let values: string = '';
		let args: string[] = []

		for (let [key, value] of Object.entries(item)) {
			if (key.toLowerCase() === 'id') continue

			if (columns) columns += ", "
			if (values) values += ", "

			columns += key
			values += '?'
			args.push(value)

			console.log(`${key}: ${escape(value)}`)
		}

		let sql = `INSERT INTO ${table} (${columns}) VALUES (${values})`
		return this.run(sql, args)
	}
}

export var database = new SqliteDb()

var SQL_SUBJECT_CREATE = `
		CREATE TABLE IF NOT EXISTS "Subject" (
			"id"	INTEGER NOT NULL UNIQUE,
			"name"	TEXT,
			PRIMARY KEY("id" AUTOINCREMENT)
		)`

var SQL_SUBJECT_FILL = `
		INSERT INTO Subject (name)
		VALUES
		   ('mathematics'),
		   ('physics'),
		   ('computer science');`

var SQL_STUDENT_CREATE = `
		CREATE TABLE IF NOT EXISTS "Student" (
			"id"	INTEGER NOT NULL UNIQUE,
			"firstName"	TEXT NOT NULL,
			"lastName"	TEXT NOT NULL,
			PRIMARY KEY("id" AUTOINCREMENT)
		)`

var SQL_STUDENT_FILL = `
		INSERT INTO Student (firstName, lastName)
		VALUES
		   ('Zyon', 'Boston'),
		   ('Baylor', 'McCoy'),
		   ('Millie', 'Falco');`

var SQL_SCORE_CREATE = `
		CREATE TABLE IF NOT EXISTS "Score" (
			"studentId"	INTEGER NOT NULL,
			"subjectId"	INTEGER NOT NULL,
			"value"	INTEGER NOT NULL,
			FOREIGN KEY("studentId") REFERENCES "Student"("id") ON DELETE CASCADE,
			FOREIGN KEY("subjectId") REFERENCES "Subject"("id") ON DELETE CASCADE
		);`

var SQL_SCORE_FILL = `
		INSERT INTO Score (studentId, subjectId, value)
		VALUES
		   ('1', '1', '9'),
		   ('1', '2', '8'),
		   ('2', '1', '5'),
		   ('2', '2', '7'),
		   ('3', '1', '6'),
		   ('3', '2', '10');`

var SQL_USER_CREATE = `
		CREATE TABLE IF NOT EXISTS "User" (
			"id"	INTEGER NOT NULL UNIQUE,
			"email"	TEXT NOT NULL UNIQUE,
			"passwordHash"	TEXT NOT NULL,
			PRIMARY KEY("id" AUTOINCREMENT)
		);`