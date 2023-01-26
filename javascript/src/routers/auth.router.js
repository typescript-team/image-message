'use strict';
const express = require('express');
const passport = require('passport');

const { login, join, logout } = require('./auth.control');
const { isLoggedIn, isNotLoggedIn } = require('../functions/status');

const router = express.Router();
// [ 로그인 처리 순서 ]
// router -> authenticate('local') -> localStrategy 실행
// -> 이메일과 비밀번호가 맞으면 -> passport.serializeUser 실행
// -> user로 부터 user.id만 꺼내서
// -> server.js에 있는 server.use(passport.session())으로 가서 user.id를 세션에 저장
// -> connect.sid라는 이름으로 세션 쿠키가 브라우저로 전송 -> 로그인 완료

router.post('/join', isNotLoggedIn, join);
router.post('/login', isNotLoggedIn, login);
router.get('/logout', isLoggedIn, logout);

// 카카오톡 로그인 화면으로 redirect
router.get('/kakao', passport.authenticate('kakao'));

/*
    미들웨어 : app.use(passport.authenticate('kakao'));
    -> 미들웨어 확장 패턴
    -> app.use((req, res, next) => passport.authenticate('kakao'))(req, res, next);
    -> 미들웨어를 확장 하는 이유는 미들웨어(로직) 안에서 req, res를 사용하기 위해서 이다.
*/

// 카카오 로그인 화면에서 로그인 하면, /kakao/callback로 데이터 전송
router.get('/kakao/callback', passport.authenticate('kakao', {
    failureRedirect: '/?loginError=카카오 로그인 실패',
}), (req, res) => {
    // 로그인 성공
    res.redirect('/');
});

module.exports = router;
