import { RequestHandler } from 'express';
import { Post, Hashtag } from '../../models/index.model';

const afterUploadImage: RequestHandler = (req, res) => {
  // 이미지 업로드 업로드 한 경우
  // single인 경우 req.file이 생기고
  // 다중 업로드인 경우, req.files가 생김
  console.log(req.file);
  // 업로드된 이미지의 URL를 보내 준다.
  res.json({ url: `/img/${req.file?.filename}` });
};

const uploadPost: RequestHandler = async (req, res, next) => {
  // 넘어온 정보
  // req.body.content : 작성한 게시글
  // req.body.url : 이전에 올렸던 이미지 URL
  // req.user :: 로그인한 사용자 정보
  try {
    const post = await Post.create({
      // 게시글 저장
      content: req.body.content,
      img: req.body.url,
      UserId: req.user?.id, // id
    });

    // 문자열 중에서 헤시태그 달린 단어(#노드)를 걸러 낸다.
    // /#[^\s#]*/g :: #이 나오고 뒤에, 공백 또는 #이 아닌 나머지
    const hashtags: string[] = req.body.content.match(/#[^\s#]*/g);
    if (hashtags) {
      // post와 hashtag 다대다 관계 형성
      const result = await Promise.all(hashtags.map(tag => {
        return Hashtag.findOrCreate({
          // 기존 헤시태그가 있으면 가져오고
          // 없으면 생성해서 가져온다.
          // tag.slice(1) : 앞에 # 없엘려구 한다.
          // 대문자가 있으면 소문자로 변경
          where: { title: tag.slice(1).toLowerCase() }
        });
      }),
      );
      // [[모델, bool],[모델, bool],[모델, bool]]
      // result.map(r => r[0]) 하면 : [모델, ,모델 ,모델]
      // 생성후 post.addHashtags() 실행
      await post.addHashtags(result.map(r => r[0]));
    }
    res.redirect('/');
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export { uploadPost, afterUploadImage };