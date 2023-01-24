import path from 'path';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import passport from 'passport';
import nunjucks from 'nunjucks';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import express, { Application } from 'express';

import IUser from './models/user.model';
import { corsOptions } from './middle/options';
import { sequelize } from './models/index.model';
import passportSetting from './passport/index.passport';
import { error404, errorHandler } from './middle/errors';

declare global {
  // error404에서 error.status에 에러
  // Error 객체에 status 속성을 추가
  interface Error { status: number; }
  // index.passport에 user.id에서 에러
  // Express.User{} 속성에 아무것도 없음
  // User 테이블 속성들을 가져와서, Express.User{}에 속성 추가
  namespace Express {
    interface User extends IUser { }
  }
}

(() => {
  const result = dotenv.config({ path: path.join(__dirname, "config", ".env") });
  if (result.parsed == undefined) throw new Error("Cannot loaded environment variables file.");
})();
passportSetting();



const server: Application = express();
server.set('view engine', 'html'); // nunjucks
nunjucks.configure('src/views', {
  express: server,
  watch: true,
});
sequelize.sync({ force: false })
  .then(() => { console.log('데이터 베이스 연결'); })
  .catch((err) => { console.error(err); })

server.use(morgan('dev'));

server.get('/', (req, res) => {
  res.send("HOHO TypeScript")
})

server.use(error404);
server.use(errorHandler);

server.listen(process.env.PORT, () => {
  console.log(`SERVER :: http://localhost:${process.env.PORT}`);
});
