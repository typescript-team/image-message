import { RequestHandler } from 'express';
import User from '../../models/user.model';

const follow: RequestHandler = async (req, res, next) => {
  // 내 아이디 : req.user.id ( followerId )
  // 팔로윙한 아이디 : req.params.id ( followingId )
  try {
    // const user = await User.findOne({ where: { id: req.user.id } });
    const result = await followService(req.user!.id, req.params.id);
    if (result) {
      await result.addFollowing(parseInt(req.params.id, 10));
      res.send('success');
    } else {
      res.status(404).send('no user');
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export { follow };