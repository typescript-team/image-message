import { RequestHandler } from 'express';
import User from '../../models/user.model';
import Post from '../../models/post.model';
import Hashtag from '../../models/hashtag.model';

const MainPage: RequestHandler = async (req, res, next) => {
  // 메인 화면 전환시, 계시글이 있으면 불러오기
  try {
    const posts = await Post.findAll({
      // 사용자 정보(게시글 쓴 사람)
      include: {
        model: User,
        attributes: ['id', 'nick']
      },
      // 게시글 불러오기
      // 최신순으로 정렬(내림차순)
      order: [['createdAt', 'DESC']]
    })
    res.render('main', {
      title: 'Image Service',
      twits: posts,  // 메인화면에서 보여줄 트윗들..
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const JoinPage: RequestHandler = (req, res, next) => {
  res.render('join', { title: '가입 페이지 - Image Service' });
};

const ProfilePage: RequestHandler = (req, res, next) => {
  res.render('profile', { title: '내 정보 - Image Service' });
};

const HashtagPage: RequestHandler = async (req, res, next) => {
  // const query = req.query.hashtag;

  // 타입 추론이 너무 많은 경우, 좁혀준다.
  const query = req.query.hashtag as string;

  if (!query) {
    // 쿼리가 없는 경우
    return res.redirect('/');
  }
  try {
    const hashtag = await Hashtag.findOne({ where: { title: query } });
    let posts: Post[] = [];
    if (hashtag) {
      // hashtag에 속해있는 post들을 가져 온다.
      posts = await hashtag.getPosts({
        // 글 작성자
        include: [{ model: User, attributes: ['id', 'nick'] }],
        // 최신순
        order: [['createdAt', 'DESC']]
      });
    }

    return res.render('main', {
      title: `${query} | Short Message Service`,
      twits: posts,
    });
  } catch (error) {
    console.error(error);
    return next(error);
  }
};

export { MainPage, JoinPage, ProfilePage, HashtagPage };