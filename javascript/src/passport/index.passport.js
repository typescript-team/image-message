const passport = require('passport');
const local = require('./local.strategy');
const kakao = require('./kakao.strategy');
const User = require('../models/user.model');

/*
    [ 로그인 실행 순서]
    1. /auth/login 라우터를 통해 로그인 요청
    2. 라우터에서, passport.authenticate 메서드 호출
    3. passport.authenticate(local)일 경우, localStrategy 호출
    4. localStrategy 실행 후, done()의 값이 전송
        1. authError : 서버 에러
        2. user : 성공 유저
        3. info : 로직 실패 (비밀번호 불일치)
    5. 성공 유저의 정보가 오면, req.login이 후출 됨
    6. req.login 메서드가 passport.serializeUser() 호출
    7. req.session에 사용자 아이디만 저장해서 세션 생성
    8. express-session에 설정한 대로 브라우저에 connect.sid 세션쿠키값 전송
    9. 로그인 완료
*/

module.exports = () => {
    passport.serializeUser((user, done) => {
        // Login시 Strategy에서 넘어온 로그인 처리 결과를 받아서 처리하는 루틴
        // 1. 성공할 경우 :: 유저 정보(passUser)가 리턴되어 오고
        // 2. 실패일 경우 에러 코드가 넘어온다. done(에러코드, 사용자 정보)
        // req.session(세션) 객체에 어떤 데이터를 저장할지 정하는 메서드

        // 매개변수
        // user :: local, kakao.strategy 실행 성공으로 넘어온 사용자 정보(passUser)
        // done() --> done(에러발생 시 코드, 저장할 데이터)

        // 세션에 사용자 아이디를 저장
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        // 로그인 후, 라우터의 각 요청이 있을때 마다 호출
        // 미들웨어의 passport.session()이 이 메서드를 호출

        // 매개변수
        // id : serializeUser에서의 done 함수의 두번째 인자로 넣었던 데이터(사용자 아이디)

        // serializeUser에서 세션에 저장했던 아이디를 받아 데이터베이스에서 사용자 정보를 조회
        // 조회한 정보를 req.user에 저장하므로 앞으로 req.user를 통해 로그인한 사용자 정보를 가져올 수 있다.
        User.findOne({
            where: { id },
            include: [{
                model: User,
                attributes: ['id', 'nick'],
                as: 'Followers',
            }, // 팔로윙
            {                
                model: User,
                attributes: ['id', 'nick'],
                as: 'Followings',
            }], // 팔로워
        })
        .then(user => done(null, user))
        // 복원된 user는 req.user로 만들고
        // req.user는 메인 라우터에 공통 변수(res.locals.user)에 저장되어
        // 모든 라우터에서 req.user를 사용한다.

        // req.session()도 생성된다.
        // 사용자에게 종속된(유지되는) 데이터 저장
        .catch(err => done(err));
    });

    local();
    kakao();
};