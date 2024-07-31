import { database } from './database'
import { BaseRepository } from './baseRepository'
import { SubjectScore, StudentScore, Score } from './model/studentScore'
import { Student } from './model/student'
import { PaginationRequest } from './paginationRequest'

const studentRepository = new BaseRepository<Student>("Student")

export class StudentScoreRepository extends BaseRepository<Score> {
    constructor() {
        super("Score")
    }

    GetByStudent(student: Student): Promise<StudentScore> {
        var sql = `
                SELECT sub.id, sub.name, score.value
                FROM Student std 
	              JOIN Score score ON std.id = score.studentId
	              JOIN Subject sub ON sub.id = score.subjectId
                WHERE std.Id = ?;`
        return database.all<SubjectScore>(sql, [student.id])
            .then(rows => {
                var studentScore = student as StudentScore;
                studentScore.scores = rows
                return studentScore
            })
    }

    GetByStudentId(studentId: number): Promise<StudentScore> {
        return studentRepository.GetById(studentId)
            .then(student => this.GetByStudent(student))
    }

    override Update(score: Score) {
        let sql = `UPDATE ${this.table} SET value = ? WHERE studentId = ? AND subjectId = ?`
        return database.run(sql, [score.value, score.studentId, score.subjectId])
    }

    DeleteEntity(score: Score) {
        let sql = `DELETE FROM ${this.table} WHERE studentId = ? AND subjectId = ?`
        return database.run(sql, [score.studentId, score.subjectId])
    }
}