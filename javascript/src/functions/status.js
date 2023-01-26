exports.isLoggedIn = (req, res, next) => {
  /*
      passport.initialize()로 초기화할 때,
      req.user, req.login, req.logout, req.isAuthenticate를 생성해 준다.

      req.isAuthenticated()
      이 함수를 통해서 사용자의 로그인한 상태를 확인할 수 있다.
  */

  if(req.isAuthenticated()) {
      next();     // 로그인한 상태
  } else {
      res.status(403).send('로그인 필요');
  }
};

exports.isNotLoggedIn = (req, res, next) => {
  if(!req.isAuthenticated()) {
      next();     // 로그인 안한 상태
  } else {
      const message = encodeURIComponent('로그인한 상태 입니다.')
      res.redirect(`/?error=${message}`); // localhost:8080?error=메시지
  }
};