"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudentScoreRepository = void 0;
const database_1 = require("./database");
const baseRepository_1 = require("./baseRepository");
const studentRepository = new baseRepository_1.BaseRepository("Student");
class StudentScoreRepository extends baseRepository_1.BaseRepository {
    constructor() {
        super("Score");
    }
    GetByStudent(student) {
        var sql = `
                SELECT sub.id, sub.name, score.value
                FROM Student std 
	              JOIN Score score ON std.id = score.studentId
	              JOIN Subject sub ON sub.id = score.subjectId
                WHERE std.Id = ?;`;
        return database_1.database.all(sql, [student.id])
            .then(rows => {
            var studentScore = student;
            studentScore.scores = rows;
            return studentScore;
        });
    }
    GetByStudentId(studentId) {
        return studentRepository.GetById(studentId)
            .then(student => this.GetByStudent(student));
    }
    Update(score) {
        let sql = `UPDATE ${this.table} SET value = ? WHERE studentId = ? AND subjectId = ?`;
        return database_1.database.run(sql, [score.value, score.studentId, score.subjectId]);
    }
    DeleteEntity(score) {
        let sql = `DELETE FROM ${this.table} WHERE studentId = ? AND subjectId = ?`;
        return database_1.database.run(sql, [score.studentId, score.subjectId]);
    }
}
exports.StudentScoreRepository = StudentScoreRepository;
//# sourceMappingURL=scoreRepository.js.map