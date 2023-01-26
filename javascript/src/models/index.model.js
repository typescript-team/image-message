'use strict';
const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');

const env = process.env.NODE_ENV || 'development';
const config = require('../config/dbconfig.json')[env];

const db = {};
const sequelize = new Sequelize(
    config.database, config.username, config.password, config,
);

db.sequelize = sequelize;

// 모델 자동 설정, db에 넣기
// initiate 전부하고 난 후에, associate를 해야 한다.

const basename = path.basename(__filename); // index.js

fs.readdirSync(__dirname)
    // 현재 폴더의 모든 파일을 조회
    .filter(file => {
        // ① 숨김파일 제외, ② index.model.js 제외, ③ 파일 이름의 마지막 8자리는 'model.js'이어야 한다.
        return file.indexOf('.') !== 0 && file !== basename && file.slice(-8) === 'model.js';
    })
    .forEach(file => {
        // 해당 파일의 모델을 불러와서 initiate
        const model = require(path.join(__dirname, file));  // 다이나믹 인포트
        // console.log(file, model.name);
        // hashtag.model.js Hashtag
        // post.model.js Post
        // user.model.js User
        db[model.name] = model;   // db.User = User, db.Post = Post, db.hashtag = Hashtag
        model.initiate(sequelize);
    });    

Object.keys(db).forEach(modelName => {
    // 모델에 associate가 존재한다면 모델.associate()
    if(db[modelName].associate) {
        db[modelName].associate(db);
    }
});

module.exports = db;