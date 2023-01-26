const bcrypt = require('bcrypt');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
// const { Strategy: LocalStrategy } = require('passport-local');

const User = require('../models/user.model');

module.exports = () => {
    passport.use(new LocalStrategy({
        // LocalStrategy에 등록
        usernameField: 'email',     // req.body.email
        passwordField: 'password',  // req.body.password
        passReqToCallback: false,   // 밑에 함수에서 req가 필요한 경우, true
    }, async (email, password, done) => {
        // 로그인 할 것인지, 안할 것이지 판단하는 부분
        try {
            const passUser = await User.findOne({ where: { email } });
            if (passUser) {
                // 비밀번호 비교
                const result = await bcrypt.compare(password, passUser.password);
                if (result) {
                    // 로그인 성공
                    // authError -> null, user -> passUser
                    done(null, passUser);
                } else {
                    // 로그인 실패
                    // authError -> null, user -> false, info -> message
                    done(null, false, { message: '비밀번호가 일치하지 않습니다.' });
                }
            } else {
                // 로그인 실패
                // authError -> null, user -> false, info -> message
                done(null, false, { message: '가입되지 않은 회원입니다.' });
            }

        } catch (error) {
            console.error(error);
            // 서버 에러
            // authError -> done(error)
            done(error);
        }
    }));
};