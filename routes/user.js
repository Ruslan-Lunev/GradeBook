"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const settings_1 = require("../settings");
const userRepository_1 = require("../data/userRepository");
const validation = require("../utils/validation");
const router = express.Router();
const userRepository = new userRepository_1.UserRepository();
router.get('/', (req, res) => {
    res.redirect('/login');
});
router.get('/login', (req, res) => {
    res.render('authentication/login');
});
router.get('/register', (req, res) => {
    res.render('authentication/register');
});
router.post('/user/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var userLogin = req.body;
    var errors = [];
    if (!validation.isLength(userLogin.password, 1))
        errors.push("Password required");
    if (!validation.isEmail(userLogin.email))
        errors.push("Wrong email");
    if (errors.length > 1)
        showLogin(res, errors);
    var users = yield userRepository.GetAll();
    var userEntity = yield userRepository.GetByEmail(userLogin.email);
    if (!userEntity)
        showLogin(res, ["Wrong credentials"]);
    var isValidPassword = yield bcrypt.compare(userLogin.password, userEntity.passwordHash);
    if (isValidPassword)
        res.redirect("/catalog/student");
    else
        showLogin(res, ["Wrong credentials"]);
}));
router.post('/user/register', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var userRegister = req.body;
    var errors = [];
    if (!validation.isLength(userRegister.password, 5, 20))
        errors.push("Password is required and should be at least 5 characters long");
    if (!validation.isEmail(userRegister.email))
        errors.push("Wrong email");
    if (errors.length > 1)
        showRegister(res, errors);
    var existingUser = yield userRepository.GetByEmail(userRegister.email);
    if (existingUser) {
        showRegister(res, ["User with same email already exists"]);
        return;
    }
    var hash = yield bcrypt.hash(userRegister.password, settings_1.security.saltRounds);
    var user = { email: userRegister.email, passwordHash: hash };
    yield userRepository.Create(user);
    authorize(res, user);
    res.redirect("/catalog/student");
}));
const showRegister = (res, errors) => {
    res.render('authentication/register', { errors: errors });
};
const showLogin = (res, errors) => {
    res.render('authentication/login', { errors: errors });
};
const authorize = (res, user) => {
    var token = generateToken(user);
    res.cookie('token', token);
    //res.writeHead(200, {
    //    "Set-Cookie": `token=${token}; HttpOnly`,
    //    "Access-Control-Allow-Credentials": "true"
    //})
};
const generateToken = (user) => {
    //var options: jwt.SignOptions = { expiresIn: 600, issuer: 'Grade Book app', audience: 'catalog' }
    var token = jwt.sign(user.email, settings_1.security.jwtSecret);
    return token;
};
exports.default = router;
//# sourceMappingURL=user.js.map