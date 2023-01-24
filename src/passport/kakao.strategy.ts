import passport from 'passport';
import { Strategy as KaKaoStrategy } from 'passport-kakao';
import User from '../models/user.model';

export default () => {
    passport.use(new KaKaoStrategy({
        clientID: process.env.COOKIE_KID!,
        callbackURL: '/auth/kakao/callback',
    }, async (accessToken, refreshToken, profile, done) => {
        console.log('kakao profile', profile);
        try {
            const exUser = await User.findOne({
                // 기존 유저 찾기
                where: { snsId: profile.id, provider: 'kakao' },
            });
            if (exUser) {
                // 로그인
                done(null, exUser);
            } else {
                // 회원가입
                console.log('email', profile._json?.kakao_account?.email); // 이메일 확인(변경 가능)
                const newUser = await User.create({
                    email: profile._json?.kakao_account?.email,                 
                    nick: profile.displayName,
                    snsId: profile.id,
                    provider: 'kakao',
                });
                done(null, newUser);
            }
        } catch(error) {
            console.log(error);
            done(error);
        }        
    }));
};