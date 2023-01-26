'use strict';
const express = require('express');
const { isLoggedIn, isNotLoggedIn } = require('../functions/status');
const { viewMainPage, viewJoinPage, viewProfilePage, viewHashTagPage } = require('./index.control');

const router = express.Router();
router.use((req, res, next) => {
  /*
    라우터용 미들웨어
    라우터들이 사용하는 템플릿 엔진에서 사용되는 변수(값) 설정

    팔로윙, 팔로워 수와 아이디 리스트를 넣는 이유는 ?
    팔로워 아이디 리스트에 게시글 작성자의 아이디가 존재하지 않으면
    팔로우 버튼을 보여 주기 위해서, '?'를 넣는 이유는 처음 접속시 req.user이 없기 때문
  */

  res.locals.user = req.user;     // req.user 사용자 정보
  res.locals.followerCount = req.user?.Followers?.length || 0;
  res.locals.followingCount = req.user?.Followings?.length || 0;
  res.locals.followingIdList = req.user?.Followings?.map(f => f.id) || [];
  next();
});



// 메인 페이지
router.get('/', viewMainPage);
// 회원 가입(로그인 안한 사람)
router.get('/join', isNotLoggedIn, viewJoinPage);
// 프로파일(로그인 한 사람)
router.get('/profile', isLoggedIn, viewProfilePage);
// 헤시태그로 게시물 찾기 => hashtag?hashtag=고양이
router.get('/hashtag', viewHashTagPage);

module.exports = router;
