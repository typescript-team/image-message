const bcrypt = require('bcrypt');
const passport = require('passport');
const { User } = require('../models/index.model');

exports.join = async (req, res, next) => {
  const { nick, email, password } = req.body;        // form 데이터 읽음
  try {
      // 같은 정보로 회원가입이 되어 있는지 확인
      const exUser = await User.findOne({ where: { email }});
      if(exUser) {
          // 이미 유저가 존재하는 경우, 에러 화면
          return res.redirect('/join?error=exist');
      }

      // 회원가입
      const hash = await bcrypt.hash(password, 12);
      await User.create({
          email, nick, password: hash,
      });
      return res.redirect('/'); //메인화면으로 가기

  } catch (error) {
      console.error(error);
      next(error);
  }
};

exports.login = async (req, res, next) => {
  // authenticate에 의해 localStrategy 호출
  // done()의 값이 오면, (authError, user, info) 실행
  // authError : 서버 에러, user : 성공 유저, info : 로직 실패
  passport.authenticate('local', (authError, user, info) => {
      if (authError) {
          // 서버 실패인 경우
          console.error(authError);
          return next(authError);
      }
      if (!user) {
          // 로직 실패, 유저가 없음(message로 넘어온 값 표시)
          return res.redirect(`/?loginError=${info.message}`);
      }

      return req.login(user, (loginError) => {
          // 로그인 성공( user : 유저 정보)
          if (loginError) {
              // 로그인 과정에서 에러가 발생할 경우
              console.error(loginError);
              return next(loginError);
          }
          return res.redirect('/');
      });

      // req.login 실행 후
      // passport/index.js에 있는 passport.serializeUser 실행

  })(req, res, next); // 미들웨어 내의 미들웨어에는 (req, res, next)를 붙입니다.
};

exports.logout = (req, res, next) => {
  req.logout(() => {
      // 로그아웃 성공시
      // 서버에 있는 세션 쿠키를 지워버린다.
      // req.session.destroy();
      res.redirect('/');
  });    
};