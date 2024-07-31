import { Request, Response } from 'express'
import { Student } from '../data/model/student'
import * as validation from '../utils/validation'
import { BaseRepository } from '../data/baseRepository'

const repository = new BaseRepository<Student>("Student")

export var list = (req: Request, res: Response) => {
    repository.GetAll()
        .then(students => res.render('student/list', { title: 'Students', students: students }))
        .catch(err => { throw new Error('Ops') })
}

export var add = (req: Request, res: Response) => {
    const student: Student = req.body

    const errors: string[] = [];
    if (!validation.isLength(student.firstName, 3, 20))
        errors.push("Wrong First Name length")
    if (!validation.isAlpha(student.firstName))
        errors.push("First Name contains wrong characters")
    if (!validation.isLength(student.lastName, 3, 20))
        errors.push("Wrong Last Name length")
    if (!validation.isAlpha(student.lastName))
        errors.push("Last Name contains wrong characters")
    if (errors.length > 0) {
        res.render('student/new', { title: 'Add Student', errors: errors, student: student })
        return
    }

    repository.Create(student)
        .then(lastId => res.redirect('/catalog/student'))
        .catch(err => res.render('student/new', { title: 'Add Student', errors: ["Unable to add new student"] }))
}

export var new_item = (req: Request, res: Response) => {
    res.render('student/new', { title: 'Add Student' })
}

export var edit = (req: Request, res: Response) => {
    const id = parseInt(req.body.id)
    repository.GetById(id)
        .then(student => res.render("student/edit", { title: 'Edit Student', student: student }))
        .catch(err => { throw new Error('Ops') })
}

export var update = (req: Request, res: Response) => {
    const student: Student = req.body

    const errors: string[] = [];
    if (!validation.isLength(student.firstName, 3, 20))
        errors.push("Wrong First Name length")
    if (!validation.isAlpha(student.firstName))
        errors.push("First Name contains wrong characters")
    if (!validation.isLength(student.lastName, 3, 20))
        errors.push("Wrong Last Name length")
    if (!validation.isAlpha(student.lastName))
        errors.push("Last Name contains wrong characters")
    if (errors.length > 0) {
        res.render('student/edit', { title: 'Edit Student', errors: errors, student: student })
        return
    }

    repository.Update(student)
        .then(lastId => res.redirect('/catalog/student'))
        .catch(err => { throw new Error('Ops') })
}

export var deleteItem = (req: Request, res: Response) => {
    const id = parseInt(req.body.id)
    repository.Delete(id)
        .then(lastId => res.redirect('/catalog/student'))
        .catch(err => { throw new Error('Ops') })
}