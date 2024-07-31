"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const requestLimiter_1 = require("./middlewares/requestLimiter");
const authentication_1 = require("./middlewares/authentication");
const user_1 = require("./routes/user");
const catalog_1 = require("./routes/catalog");
const app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/favicon.ico', express.static(path.join(__dirname, 'public', 'images', 'favicon.ico')));
var requestLimiter = new requestLimiter_1.RequestLimiter();
app.use(requestLimiter.express);
app.use('/', user_1.default);
app.use('/catalog', authentication_1.authenticate, catalog_1.default);
// catch 404 and forward to error handler
app.use((req, res, next) => {
    const err = new Error('Not Found');
    err['status'] = 404;
    next(err);
});
// error handlers
app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});
app.set('port', process.env.PORT || 3000);
const server = app.listen(app.get('port'), () => {
    console.log(`Express server listening on port ${server.address().port}`);
});
server.timeout = 5000;
server.headersTimeout = 2000;
server.requestTimeout = 2000;
//# sourceMappingURL=app.js.map