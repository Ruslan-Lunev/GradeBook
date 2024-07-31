"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteItem = exports.update = exports.edit = exports.new_item = exports.add = exports.list = void 0;
const validation = require("../utils/validation");
const baseRepository_1 = require("../data/baseRepository");
const repository = new baseRepository_1.BaseRepository("Student");
var list = (req, res) => {
    repository.GetAll()
        .then(students => res.render('student/list', { title: 'Students', students: students }))
        .catch(err => { throw new Error('Ops'); });
};
exports.list = list;
var add = (req, res) => {
    const student = req.body;
    const errors = [];
    if (!validation.isLength(student.firstName, 3, 20))
        errors.push("Wrong First Name length");
    if (!validation.isAlpha(student.firstName))
        errors.push("First Name contains wrong characters");
    if (!validation.isLength(student.lastName, 3, 20))
        errors.push("Wrong Last Name length");
    if (!validation.isAlpha(student.lastName))
        errors.push("Last Name contains wrong characters");
    if (errors.length > 0) {
        res.render('student/new', { title: 'Add Student', errors: errors, student: student });
        return;
    }
    repository.Create(student)
        .then(lastId => res.redirect('/catalog/student'))
        .catch(err => res.render('student/new', { title: 'Add Student', errors: ["Unable to add new student"] }));
};
exports.add = add;
var new_item = (req, res) => {
    res.render('student/new', { title: 'Add Student' });
};
exports.new_item = new_item;
var edit = (req, res) => {
    const id = parseInt(req.body.id);
    repository.GetById(id)
        .then(student => res.render("student/edit", { title: 'Edit Student', student: student }))
        .catch(err => { throw new Error('Ops'); });
};
exports.edit = edit;
var update = (req, res) => {
    const student = req.body;
    const errors = [];
    if (!validation.isLength(student.firstName, 3, 20))
        errors.push("Wrong First Name length");
    if (!validation.isAlpha(student.firstName))
        errors.push("First Name contains wrong characters");
    if (!validation.isLength(student.lastName, 3, 20))
        errors.push("Wrong Last Name length");
    if (!validation.isAlpha(student.lastName))
        errors.push("Last Name contains wrong characters");
    if (errors.length > 0) {
        res.render('student/edit', { title: 'Edit Student', errors: errors, student: student });
        return;
    }
    repository.Update(student)
        .then(lastId => res.redirect('/catalog/student'))
        .catch(err => { throw new Error('Ops'); });
};
exports.update = update;
var deleteItem = (req, res) => {
    const id = parseInt(req.body.id);
    repository.Delete(id)
        .then(lastId => res.redirect('/catalog/student'))
        .catch(err => { throw new Error('Ops'); });
};
exports.deleteItem = deleteItem;
//# sourceMappingURL=studentController.js.map