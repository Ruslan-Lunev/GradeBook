"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteItem = exports.new_item = exports.add = exports.update = exports.list = void 0;
const validation = require("../utils/validation");
const scoreRepository_1 = require("../data/scoreRepository");
const baseRepository_1 = require("../data/baseRepository");
const repository = new scoreRepository_1.StudentScoreRepository();
const subjectRepository = new baseRepository_1.BaseRepository("Subject");
var list = (req, res) => {
    const studentId = parseInt(req.body.id);
    showScoresFor(res, studentId);
};
exports.list = list;
var update = (req, res) => {
    const score = req.body;
    const errors = validateScore(score);
    if (errors.length > 0) {
        showScoresFor(res, score.studentId);
        return;
    }
    repository.Update(score).then(_ => showScoresFor(res, score.studentId));
};
exports.update = update;
var add = (req, res) => {
    const score = req.body;
    const errors = validateScore(score);
    if (errors.length > 0) {
        showCreateScore(res, score.studentId, errors);
        return;
    }
    repository.Create(score).then(_ => showScoresFor(res, score.studentId));
};
exports.add = add;
var new_item = (req, res) => {
    const studentId = parseInt(req.body.id);
    showCreateScore(res, studentId);
};
exports.new_item = new_item;
var deleteItem = (req, res) => {
    const score = req.body;
    repository.DeleteEntity(score)
        .then(_ => repository.GetByStudentId(score.studentId))
        .then(studentScore => res.render('score/list', { title: 'Score', studentScore: studentScore }))
        .catch(err => { throw new Error('Ops'); });
};
exports.deleteItem = deleteItem;
const showScoresFor = (res, studentId) => {
    return repository.GetByStudentId(studentId)
        .then(studentScore => res.render('score/list', { title: 'Score', studentScore: studentScore }))
        .catch(err => { throw new Error('Ops'); });
};
const validateScore = (score) => {
    const errors = [];
    if (!validation.isRange(score.value, 1, 10))
        errors.push("Wrong value range");
    return errors;
};
var showCreateScore = (res, studentId, errors) => {
    subjectRepository.GetAll()
        .then(subjects => res.render('score/new', {
        title: 'Add Score',
        studentId: studentId,
        subjects: subjects,
        errors: errors
    }));
};
//# sourceMappingURL=scoreController.js.map