import * as express from 'express'
import * as bcrypt from 'bcrypt'
import * as jwt from 'jsonwebtoken';
import { security } from '../settings'
import { UserLogin, UserRegister, User } from '../data/model/user';
import { UserRepository } from "../data/userRepository"
import * as validation from "../utils/validation"
const router = express.Router();

const userRepository = new UserRepository()

router.get('/', (req: express.Request, res: express.Response) => {
    res.redirect('/login');
});

router.get('/login', (req: express.Request, res: express.Response) => {
    res.render('authentication/login');
});

router.get('/register', (req: express.Request, res: express.Response) => {
    res.render('authentication/register');
});

router.post('/user/login', async (req: express.Request, res: express.Response) => {
    var userLogin: UserLogin = req.body

    var errors: string[] = []

    if (!validation.isLength(userLogin.password, 1))
        errors.push("Password required")
    if (!validation.isEmail(userLogin.email))
        errors.push("Wrong email")
    if (errors.length > 1)
        showLogin(res, errors)

    var users = await userRepository.GetAll()
    var userEntity = await userRepository.GetByEmail(userLogin.email)
    if (!userEntity)
        showLogin(res, ["Wrong credentials"])

    var isValidPassword = await bcrypt.compare(userLogin.password, userEntity.passwordHash)
    if (isValidPassword)
        res.redirect("/catalog/student")
    else
        showLogin(res, ["Wrong credentials"])
});

router.post('/user/register', async (req: express.Request, res: express.Response) => {
    var userRegister: UserRegister = req.body

    var errors: string[] = []

    if (!validation.isLength(userRegister.password, 5, 20))
        errors.push("Password is required and should be at least 5 characters long")
    if (!validation.isEmail(userRegister.email))
        errors.push("Wrong email")
    if (errors.length > 1)
        showRegister(res, errors)

    var existingUser = await userRepository.GetByEmail(userRegister.email)
    if (existingUser) {
        showRegister(res, ["User with same email already exists"])
        return
    }

    var hash = await bcrypt.hash(userRegister.password, security.saltRounds)
    var user: User = { email: userRegister.email, passwordHash: hash }
    await userRepository.Create(user)
    authorize(res, user)
    res.redirect("/catalog/student")
});

const showRegister = (res: express.Response, errors: string[]) => {
    res.render('authentication/register', { errors: errors })
}

const showLogin = (res: express.Response, errors: string[]) => {
    res.render('authentication/login', { errors: errors })
}

const authorize = (res: express.Response, user:User) => {
    var token = generateToken(user)
    res.cookie('token', token)
    //res.writeHead(200, {
    //    "Set-Cookie": `token=${token}; HttpOnly`,
    //    "Access-Control-Allow-Credentials": "true"
    //})
}

const generateToken = (user: User) => {
    //var options: jwt.SignOptions = { expiresIn: 600, issuer: 'Grade Book app', audience: 'catalog' }
    var token = jwt.sign(user.email, security.jwtSecret);
    return token
}

export default router;