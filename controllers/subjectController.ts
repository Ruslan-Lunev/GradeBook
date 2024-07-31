import { Request, Response } from 'express'
import { Subject } from '../data/model/subject'
import * as validation from '../utils/validation'
import { BaseRepository } from '../data/baseRepository'

const repository = new BaseRepository<Subject>("Subject")

export var list = (req: Request, res: Response) => {
    repository.GetAll()
        .then(subjects => res.render('subject/list', { title: 'Subjects', subjects: subjects }))
        .catch(err => { throw new Error('Ops') })
}

export var add = (req: Request, res: Response) => {
    const subject: Subject = req.body

    const errors: string[] = [];
    if (!validation.isLength(subject.name, 3, 20))
        errors.push("Wrong length")
    if (!validation.isAlphaWhite(subject.name))
        errors.push("Wrong characters")
    if (errors.length > 0) {
        res.render('subject/new', { title: 'Add Subject', errors: errors, subject: subject })
        return
    }

    repository.Create(subject)
        .then(lastId => res.redirect('/catalog/subject'))
        .catch(err => res.render('subject/new', { title: 'Add Subject', errors: ["Unable to add new subject"] }))
}

export var new_item = (req: Request, res: Response) => {
    res.render('subject/new', { title: 'Add Subject' })
}

export var edit = (req: Request, res: Response) => {
    const id = parseInt(req.body.id)
    repository.GetById(id)
        .then(subject => res.render("subject/edit", { title: 'Edit Subject', subject: subject }))
        .catch(err => { throw new Error('Ops') })
}

export var update = (req: Request, res: Response) => {
    const subject: Subject = req.body

    const errors: string[] = [];
    if (!validation.isLength(subject.name, 3, 20))
        errors.push("Wrong length")
    if (!validation.isAlphaWhite(subject.name))
        errors.push("Wrong characters")
    if (errors.length > 0) {
        res.render('subject/edit', { title: 'Edit Subject', errors: errors, subject: subject })
        return;
    }

    repository.Update(subject)
        .then(lastId => res.redirect('/catalog/subject'))
        .catch(err => { throw new Error('Ops') })
}

export var deleteItem = (req: Request, res: Response) => {
    const id = parseInt(req.body.id)
    repository.Delete(id)
        .then(lastId => res.redirect('/catalog/subject'))
        .catch(err => { throw new Error('Ops') })
}