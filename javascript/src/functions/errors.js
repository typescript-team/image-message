exports.error404 = (req, res, next) => {
  const error = new Error(`++ ${req.method} :: ${req.url} 라우터가 없습니다.`);
  error.status = 404;
  next(error);
};

exports.errorHandler = (err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = process.env.NODE_ENV !== 'production' ? err : {}; // 에러 로그 서비스에 넘김
  res.status(err.status || 500);
  res.render('error');
};