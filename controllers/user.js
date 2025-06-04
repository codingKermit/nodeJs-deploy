const User = require('../models/user');
const userCache = require('../passport/cache');
const { follow, unfollow } = require('../services/user');

exports.follow = async (req,res,next) => {

    const id = req.user.id;
    const followId = req.params.id;

    console.log(`사용자 아아디 ${id} 가 ${followId} 를 팔로우 합니다.`);

    try {
        const result = await follow(id,followId);
        if(result === 'ok'){
            res.send('success');
        } else if (result === 'no user'){
            res.status(404).send('no user');
        }
    } catch (error) {
        console.error('follow 에러',error);
        next(error);
    }
}

exports.unfollow = async (req,res,next) => {
    const id = req.user.id;
    const unfollowId = req.params.id

    console.log(`${id} 사용자가 ${unfollowId} 를 언팔로우 합니다`);

    try {
        const result = await unfollow(id,unfollowId);
        if(result === 'ok'){
            res.send('success');
        } else if (result === 'no user'){
            res.status(404).send('no user');
        }
    } catch (error) {
        console.error(error);
        next(error);
    }
}