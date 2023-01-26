'use strict';
const { User, Post, Hashtag } = require('../models/index.model');

exports.viewMainPage = async (req, res, next) => {
	// 메인 화면 전환시, 게시글이 있으면 불러오기
	try {
		// 게시글을 불러온다.
		const posts = await Post.findAll({
			// 게시글을 불러 오면서 게시글의 작성자 정보도 같이 불러온다.
			include: {
				model: User,
				attributes: ['id', 'nick']
			},
			// 게시글, 최신순으로 정렬(내림차순)
			order: [['createdAt', 'DESC']]
		});

		// 데이터 전송
		// 메인화면 타이틀, 메인화면에서 보여줄 게시글
		res.render('main', {
			title: 'Short Message Service',
			twits: posts,
		});
  } catch(error) {
      console.error(error);
      next(error);
  }
};

exports.viewJoinPage = async (req, res, next) => {
  try {
      res.render('join', {title: '가입 페이지 - image service'});
  } catch(error) {
      console.error(error);
      next(error);
  }
};

exports.viewProfilePage = async (req, res, next) => {
  try {
      res.render('profile', {title: '내 정보 - image service'});
  } catch(error) {
      console.error(error);
      next(error);
  }
};

exports.viewHashTagPage = async (req, res, next) => {
  const query = req.query.hashtag;

  if (!query) {
      // 쿼리가 없는 경우
      return res.redirect('/');
  }
  try {
      // 헤시태그가 존재하는지 확인
      const hashtag = await Hashtag.findOne({ where: { title: query } });
      let posts = [];
      if (hashtag) {
          // 헤시태그가 존재 한다면
          // hashtag를 포함하는 post(hashtag.getPosts())들을 가져 온다.
          posts = await hashtag.getPosts({
              // 게시글을 작성한 작성자의 정보 읽어옴
              include: [{ model: User, attributes: ['id', 'nick']}],
              // 최신순
              order: [['createdAt', 'DESC']]
          });
      }

      return res.render('main', {
          title: `${query} | image service`,
          twits: posts,
      });
  } catch (error) {
      console.error(error);
      return next(error);
  }
};