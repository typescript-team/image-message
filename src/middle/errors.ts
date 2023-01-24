import express, { RequestHandler, ErrorRequestHandler } from 'express';

const error404: RequestHandler = (req, res, next) => {
  const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
  // status 속성이 없다고 에러 발생
  // lib.es5.d.ts 파일에 interface Error {}에 status 속성이 없다.

  // interface Error()에 status 속성 추가
  error.status = 404;
  next(error);
};

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  // ErrorRequestHandler ==> err, req, res, next 타입 정의

  console.log('-------> ' + err.message);
  res.locals.message = err.message;
  res.locals.error = process.env.NODE_ENV !== 'production' ? err : {};
  res.status(err.status || 500);
  // res.render('error');
};

export { error404, errorHandler };