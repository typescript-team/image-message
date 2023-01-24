import bcrypt from 'bcrypt';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';

import User from '../models/user.model';

// 루틴이 성공하면, 유저 정보(exUser)를 done() 함수에 넣어서 리턴

export default () => {
    passport.use(new LocalStrategy({
        usernameField: 'email',     // req.body.email
        passwordField: 'password',  // req.body.password
        passReqToCallback: false,   // 밑에 함수에서 req가 필요한 경우, true
    }, async (email, password, done) => {
        // 로그인 할 것인지, 안할 것이지 판단하는 부분
        try {
            const exUser = await User.findOne({ where: { email } });
            if (exUser) {
                // 비밀번호 비교
                const result = await bcrypt.compare(password, exUser.password);
                if (result) {
                    // 비밀번호가 일치하는 경우 (exUser : 사용자 정보)
                    done(null, exUser);
                } else {
                    done(null, false, { message: '비밀번호가 일치하지 않습니다.' });
                }
            } else {
                done(null, false, { message: '가입되지 않은 회원입니다.' });
            }
        } catch (error) {
            console.error(error);
            done(error);        // 서버(시스템) 실패
        }
    }));
};