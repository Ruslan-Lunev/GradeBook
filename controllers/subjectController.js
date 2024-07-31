"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteItem = exports.update = exports.edit = exports.new_item = exports.add = exports.list = void 0;
const validation = require("../utils/validation");
const baseRepository_1 = require("../data/baseRepository");
const repository = new baseRepository_1.BaseRepository("Subject");
var list = (req, res) => {
    repository.GetAll()
        .then(subjects => res.render('subject/list', { title: 'Subjects', subjects: subjects }))
        .catch(err => { throw new Error('Ops'); });
};
exports.list = list;
var add = (req, res) => {
    const subject = req.body;
    const errors = [];
    if (!validation.isLength(subject.name, 3, 20))
        errors.push("Wrong length");
    if (!validation.isAlphaWhite(subject.name))
        errors.push("Wrong characters");
    if (errors.length > 0) {
        res.render('subject/new', { title: 'Add Subject', errors: errors, subject: subject });
        return;
    }
    repository.Create(subject)
        .then(lastId => res.redirect('/catalog/subject'))
        .catch(err => res.render('subject/new', { title: 'Add Subject', errors: ["Unable to add new subject"] }));
};
exports.add = add;
var new_item = (req, res) => {
    res.render('subject/new', { title: 'Add Subject' });
};
exports.new_item = new_item;
var edit = (req, res) => {
    const id = parseInt(req.body.id);
    repository.GetById(id)
        .then(subject => res.render("subject/edit", { title: 'Edit Subject', subject: subject }))
        .catch(err => { throw new Error('Ops'); });
};
exports.edit = edit;
var update = (req, res) => {
    const subject = req.body;
    const errors = [];
    if (!validation.isLength(subject.name, 3, 20))
        errors.push("Wrong length");
    if (!validation.isAlphaWhite(subject.name))
        errors.push("Wrong characters");
    if (errors.length > 0) {
        res.render('subject/edit', { title: 'Edit Subject', errors: errors, subject: subject });
        return;
    }
    repository.Update(subject)
        .then(lastId => res.redirect('/catalog/subject'))
        .catch(err => { throw new Error('Ops'); });
};
exports.update = update;
var deleteItem = (req, res) => {
    const id = parseInt(req.body.id);
    repository.Delete(id)
        .then(lastId => res.redirect('/catalog/subject'))
        .catch(err => { throw new Error('Ops'); });
};
exports.deleteItem = deleteItem;
//# sourceMappingURL=subjectController.js.map