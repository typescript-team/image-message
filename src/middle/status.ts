import { RequestHandler } from 'express';

// RequestHandler ==> req, res, next 타입 정의 (함수 자체 타입 넣기)
// isLoggedIn = (req: Request, res: Response, next: NextFunction) => {}
// ⤷ isLoggedIn: RequestHandler = (req, res, next) => {}

const isLoggedIn: RequestHandler = (req, res, next) => {
    // passport.initialize()로 초기화할 때,
    // req.user, req.login, req.logout, req.isAuthenticate 생성
    // isAuthenticated() 함수를 통해서 사용자의 로그인한 상태를 확인할 수 있다.

    if (req.isAuthenticated()) {
        next();
    } else {
        res.status(403).send('로그인 필요');
    }
};

const isNotLoggedIn: RequestHandler = (req, res, next) => {
    if (!req.isAuthenticated()) {
        next();
    } else {
        const message = encodeURIComponent('로그인한 상태 입니다.')
        res.redirect(`/?error=${message}`); // localhost:8080?error=메시지
    }
};

export { isLoggedIn, isNotLoggedIn };