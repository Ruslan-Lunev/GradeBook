"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.database = exports.SqliteDb = void 0;
const querystring_1 = require("querystring");
const sqlite3_1 = require("sqlite3");
/**
 * Wrapper around sqlite3.Database to provide promises.
 */
class SqliteDb {
    constructor() {
        this.db = new sqlite3_1.Database(':memory:', err => {
            if (err)
                return console.error(err.message);
            else
                this.init();
        });
    }
    /**
     * Creates tables and fills them with some initial data.
     */
    init() {
        console.log('Connected to the in-memory SQlite database.');
        this.db.serialize(() => {
            this.db.run(SQL_SUBJECT_CREATE);
            this.db.run(SQL_SUBJECT_FILL);
            this.db.run(SQL_STUDENT_CREATE);
            this.db.run(SQL_STUDENT_FILL);
            this.db.run(SQL_SCORE_CREATE);
            this.db.run(SQL_SCORE_FILL);
            this.db.run(SQL_USER_CREATE);
        });
    }
    run(sql, params = []) {
        return new Promise((resolve, reject) => {
            this.db.run(sql, params, function (err) {
                if (err) {
                    console.log('Error running sql ' + sql);
                    console.log(err);
                    reject(err);
                }
                else {
                    resolve(this.lastID);
                }
            });
        });
    }
    all(sql, params) {
        return new Promise((resolve, reject) => {
            this.db.all(sql, params, function (err, rows) {
                if (err) {
                    console.log('Error running sql ' + sql);
                    console.log(err);
                    reject(err);
                }
                else {
                    resolve(rows);
                }
            });
        });
    }
    tableAll(table, paginationRequest) {
        let args = [];
        var sql = `SELECT * FROM ${table}`;
        if (paginationRequest) {
            sql += " ? OFFSET ?";
            args = [paginationRequest.pageSize, paginationRequest.offset()];
        }
        return this.all(sql, args);
    }
    get(sql, params) {
        return new Promise((resolve, reject) => {
            this.db.get(sql, params, function (err, row) {
                if (err) {
                    console.log('Error running sql ' + sql);
                    console.log(err);
                    reject(err);
                }
                else {
                    resolve(row);
                }
            });
        });
    }
    getById(table, id) {
        return this.get(`SELECT * FROM ${table} WHERE Id = ?`, [id]);
    }
    deleteById(table, id) {
        return this.run(`DELETE FROM ${table} WHERE id = ?`, [id]);
    }
    update(table, item) {
        let pairs = '';
        let id = undefined;
        for (let [key, value] of Object.entries(item)) {
            if (key.toLowerCase() === 'id') {
                id = value;
                continue;
            }
            if (pairs)
                pairs += ", ";
            pairs += `'${key}' = '${(0, querystring_1.escape)(value)}'`;
        }
        if (id === undefined)
            throw new Error('Entity must have an id');
        let sql = `UPDATE ${table} SET ${pairs} WHERE id = ?`;
        return this.run(sql, [id]);
    }
    create(table, item) {
        let columns = '';
        let values = '';
        let args = [];
        for (let [key, value] of Object.entries(item)) {
            if (key.toLowerCase() === 'id')
                continue;
            if (columns)
                columns += ", ";
            if (values)
                values += ", ";
            columns += key;
            values += '?';
            args.push(value);
            console.log(`${key}: ${(0, querystring_1.escape)(value)}`);
        }
        let sql = `INSERT INTO ${table} (${columns}) VALUES (${values})`;
        return this.run(sql, args);
    }
}
exports.SqliteDb = SqliteDb;
exports.database = new SqliteDb();
var SQL_SUBJECT_CREATE = `
		CREATE TABLE IF NOT EXISTS "Subject" (
			"id"	INTEGER NOT NULL UNIQUE,
			"name"	TEXT,
			PRIMARY KEY("id" AUTOINCREMENT)
		)`;
var SQL_SUBJECT_FILL = `
		INSERT INTO Subject (name)
		VALUES
		   ('mathematics'),
		   ('physics'),
		   ('computer science');`;
var SQL_STUDENT_CREATE = `
		CREATE TABLE IF NOT EXISTS "Student" (
			"id"	INTEGER NOT NULL UNIQUE,
			"firstName"	TEXT NOT NULL,
			"lastName"	TEXT NOT NULL,
			PRIMARY KEY("id" AUTOINCREMENT)
		)`;
var SQL_STUDENT_FILL = `
		INSERT INTO Student (firstName, lastName)
		VALUES
		   ('Zyon', 'Boston'),
		   ('Baylor', 'McCoy'),
		   ('Millie', 'Falco');`;
var SQL_SCORE_CREATE = `
		CREATE TABLE IF NOT EXISTS "Score" (
			"studentId"	INTEGER NOT NULL,
			"subjectId"	INTEGER NOT NULL,
			"value"	INTEGER NOT NULL,
			FOREIGN KEY("studentId") REFERENCES "Student"("id") ON DELETE CASCADE,
			FOREIGN KEY("subjectId") REFERENCES "Subject"("id") ON DELETE CASCADE
		);`;
var SQL_SCORE_FILL = `
		INSERT INTO Score (studentId, subjectId, value)
		VALUES
		   ('1', '1', '9'),
		   ('1', '2', '8'),
		   ('2', '1', '5'),
		   ('2', '2', '7'),
		   ('3', '1', '6'),
		   ('3', '2', '10');`;
var SQL_USER_CREATE = `
		CREATE TABLE IF NOT EXISTS "User" (
			"id"	INTEGER NOT NULL UNIQUE,
			"email"	TEXT NOT NULL UNIQUE,
			"passwordHash"	TEXT NOT NULL,
			PRIMARY KEY("id" AUTOINCREMENT)
		);`;
//# sourceMappingURL=database.js.map