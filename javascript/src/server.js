'use strict';
const path = require('path');
const dotenv = require('dotenv');
const morgan = require('morgan');
const express = require('express');
const nunjucks = require('nunjucks');
const passport = require('passport');
const session = require('express-session');
const cookieParser = require('cookie-parser');

const { sequelize } = require('./models/index.model');
const passportConfig = require('./passport/index.passport');
const { error404, errorHandler } = require('./functions/errors');

(() => {
  const result = dotenv.config({ path: path.join(__dirname, "config", ".env") });
  if (result.parsed == undefined) throw new Error("Cannot loaded environment variables file.");
})();

const authRouter = require('./routers/auth.router');
const userRouter = require('./routers/user.router');
const postRouter = require('./routers/post.router');
const indexRouter = require('./routers/index.router');

const server = express();

passportConfig();
server.set('view engine', 'html'); // nunjucks
nunjucks.configure('src/views', {
    express: server,
    watch: true,
});
sequelize.sync({ force: false })
.then(()=> { console.log('데이터 베이스 연결'); })
.catch((err) => { console.error(err); })
server.use(morgan('dev'));
server.use('/', express.static(path.join(__dirname, '..', 'public')));
server.use('/img', express.static(path.join(__dirname, '..', 'uploads')));
server.use(express.json()); // req.body를 ajax json 요청으로 부터 사용
server.use(express.urlencoded({extended: false})); // req.body로 부터 form 데이터(name)를 사용
server.use(session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
        httpOnly: true,     // javascript 보안
        secure: false,      // https
    }
}));
server.use(passport.initialize());
// passport 로그인에 필요한 객체를 생성
// req.user, req.login, req.isAuthenticate, req.logout
server.use(passport.session());
// passport.serializeUser 성공해서 생성된 user.id 값을 세션에 저장하고
// express-session에 설정한 대로 브라우저에 connect.sid 세션 쿠키 전송
// 쿠키로 로그인할 수 있게 도와 준다. connect.sid=1212121212

server.use('/', indexRouter);
server.use('/user', userRouter);
server.use('/post', postRouter);
server.use('/auth', authRouter);

server.use(error404);
server.use(errorHandler);

module.exports = server;