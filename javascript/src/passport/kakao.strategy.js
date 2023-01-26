const passport = require('passport');
const KakaoStrategy = require('passport-kakao').Strategy;
// https://www.passportjs.org/packages/passport-kakao/

const User = require('../models/user.model');
/*
_json: {
    id: 1545323967,
    connected_at: '2020-11-28T06:40:05Z',
    properties: {
        nickname: '******',
        profile_image: 'http://k.kakaocdn.net/dn/dpk9l1/btqmGhA2lKL/Oz0wDuJn1YV2DIn92f6DVK/img_640x640.jpg',
        thumbnail_image: 'http://k.kakaocdn.net/dn/dpk9l1/btqmGhA2lKL/Oz0wDuJn1YV2DIn92f6DVK/img_110x110.jpg'
    },
    kakao_account: {
        profile_needs_agreement: false,
        profile: [Object],
        has_email: true,
        email_needs_agreement: false,
        is_email_valid: true,
        is_email_verified: true,
        email: '********@kakao.com',
        has_age_range: true,
        age_range_needs_agreement: false,
        age_range: '50~59',
        has_gender: false,
        gender_needs_agreement: false
        }
    }
}
*/

module.exports = () => {
    passport.use(new KakaoStrategy({
        // 설정
        clientID: process.env.COOKIE_KID,
        callbackURL: '/auth/kakao/callback',
    }, async (accessToken, refreshToken, profile, done) => {
        // 콜백
        // accessToken, refreshToken : 카카오 API가 전송해 줌, API 호출 시 사용
        // profile : 사용자 정보(변경 가능)
        // done : 로그인 처리
        console.log('kakao profile', profile);
        try {
            const passUser = await User.findOne({
                // 기존 유저 찾기
                where: { snsId: profile.id, provider: 'kakao' },
            });
            if (passUser) {
                // 로그인 성공
                // authError -> null, user -> passUser
                done(null, passUser);
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
        } catch (error) {
            console.error(error);
            done(error);
        }
    }));
};
