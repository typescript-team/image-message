import passport from 'passport';
import local from './local.strategy';
import kakao from './kakao.strategy';
import User from '../models/user.model';
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
export default () => {
    passport.serializeUser((user, done) => {
        // Login할 때 호출
        // Strategy에서 넘어온 로그인 처리 결과를 받아서 처리
        // 성공할 경우, 유저 정보(user, exUser)가 리턴되어 오고
        // 실패일 경우 에러 코드가 넘어온다. done(에러코드, 사용자 정보)

        // req.session에 사용자 아이디만 저장
        // { 세션 쿠키 : 유저 아아디 } -> 세션에 저장 => { 1212121212 : user.id }
        done(null, user.id);

        // index.d.ts 파일에 정의된
        // namespace Express { interface User {}}
        // User 인터페이스에 속성이 하나도 없다.
        // 여기에 'id' 속성이 없어서, user.id에 에러 발생

        // 해결법 --> src/types/index.d.ts 파일에 정의
        // interface User{}를 확장해서, id 속성을 넣으면 된다.
        // declare global { interface User { id: number; }}
    });

    passport.deserializeUser((id: number, done) => {
        // Login 후, 접속할 때 마다 호출
        // 전해지는 세션 쿠키로 부터 유저 아이디를 찾아
        // 유저(req.user)를 복원 시킨다.
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