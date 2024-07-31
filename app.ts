import * as express from 'express';
import { AddressInfo } from "net";
import * as path from 'path';
import * as cookieParser from 'cookie-parser';

import userRoute from './routes/user';
import catalogRoute from './routes/catalog';
import { LimiterOptions, RequestLimiter } from './middlewares/requestLimiter';
import { authenticate } from './middlewares/authentication';

const debug = require('debug')('Grade Book app');
const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(express.json());
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())

app.use(express.static(path.join(__dirname, 'public')));
app.use('/favicon.ico', express.static(path.join(__dirname, 'public', 'images', 'favicon.ico')));

var requestLimiter = new RequestLimiter()
app.use(requestLimiter.express)

app.use('/', userRoute);
app.use('/catalog', authenticate, catalogRoute);

// catch 404 and forward to error handler
app.use((req, res, next) => {
    const err = new Error('Not Found');
    err[ 'status' ] = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use((err, req, res, next) => {
        res.status(err[ 'status' ] || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

app.set('port', process.env.PORT || 3000);

const server = app.listen(app.get('port'), () => {
    debug(`Express server listening on port ${(server.address() as AddressInfo).port}`);
});

//server.timeout = 5000
//server.headersTimeout = 2000
//server.requestTimeout = 2000