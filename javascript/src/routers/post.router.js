'use strict';
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const express = require('express');

const { isLoggedIn } = require('../functions/status');
const { uploadPost, afterUploadImage } = require('./post.control');

const router = express.Router();

try {
  // uploads 폴더 확인
  fs.readdirSync('uploads');
} catch (error) {
  // 없으면, 폴더 생성
  console.error('uploads 폴더가 없어 uploads 폴더를 생성합니다.');
  fs.mkdirSync('uploads');
}

const upload = multer({
  // 이미지만 업로드
  storage: multer.diskStorage({
      // 파일 저장은 디스크 폴더(uploads)에 한다.
      destination(req, file, cb) {
          cb(null, 'uploads/');
      },
      filename(req, file, cb) {
          // 파일 저장 이름 설정
          // image.png -> image날짜.png
          const ext = path.extname(file.originalname);
          cb(null, path.basename(file.originalname, ext) + Date.now() + ext);
      },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },  // 5M
});

// 이미지를 업로드하고 
// -> 업로드한 이미지 정보(img-url)를 받아서,
// -> 게시글 업로드한다.(req.body.content, req.body.url)

// POST /post/img : 이미지를 업로드 하는 루틴
// upload.single('img') : 이미지업로드 하는 루틴
// afterUploadImage : 이미지 업로드하고, 저장 위치를 리턴('/img/${req.file.filename}')
router.post('/img', isLoggedIn, upload.single('img'), afterUploadImage);

// POST /post
// uploadPost : 게시글(text)을 업로드 하는 루틴
const upload2 = multer();
router.post('/', isLoggedIn, upload2.none(), uploadPost);

module.exports = router;
