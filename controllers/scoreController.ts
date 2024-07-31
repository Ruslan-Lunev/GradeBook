import { Request, Response } from 'express'
import { SubjectScore, Score } from '../data/model/studentScore'
import * as validation from '../utils/validation'
import { StudentScoreRepository } from '../data/scoreRepository'
import { BaseRepository } from '../data/baseRepository'
import { Subject } from '../data/model/subject'

const repository = new StudentScoreRepository()
const subjectRepository = new BaseRepository<Subject>("Subject")

export var list = (req: Request, res: Response) => {
    const studentId = parseInt(req.body.id)
    showScoresFor(res, studentId)
}

export var update = (req: Request, res: Response) => {
    const score: Score = req.body

    const errors = validateScore(score)
    if (errors.length > 0) {
        showScoresFor(res, score.studentId)
        return;
    }

    repository.Update(score).then(_ => showScoresFor(res, score.studentId))
}

export var add = async (req: Request, res: Response) => {
    const score: Score = req.body

    const errors = validateScore(score)
    if (errors.length > 0) {
        showCreateScore(res, score.studentId, errors)
        return;
    }

    var all = await repository.GetAll()
    var existsSimilarScore = await repository.ScoreExists(score)
    if (existsSimilarScore) {
        showCreateScore(res, score.studentId, ['Score for this subject already exists'])
        return;
    }

    repository.Create(score).then(_ => showScoresFor(res, score.studentId))
}

export var new_item = (req: Request, res: Response) => {
    const studentId = parseInt(req.body.id)
    showCreateScore(res, studentId)
}

export var deleteItem = (req: Request, res: Response) => {
    const score: Score = req.body
    repository.DeleteEntity(score)
        .then(_ => repository.GetByStudentId(score.studentId))
        .then(studentScore => res.render('score/list', { title: 'Score', studentScore: studentScore }))
        .catch(err => { throw new Error('Ops') })
}

const showScoresFor = (res: Response, studentId: number) =>
{
    return repository.GetByStudentId(studentId)
        .then(studentScore => res.render('score/list', { title: 'Score', studentScore: studentScore }))
        .catch(err => { throw new Error('Ops') })
}

const validateScore = (score: Score):string[] => {
    const errors: string[] = [];
    if (!validation.isRange(score.value, 1, 10))
        errors.push("Wrong value range")

    return errors;
}

var showCreateScore = (res: Response, studentId:number, errors?:string[]) => {
    subjectRepository.GetAll()
        .then(subjects => res.render('score/new', {
            title: 'Add Score',
            studentId: studentId,
            subjects: subjects,
            errors: errors
        }))
}