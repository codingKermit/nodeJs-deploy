import { follow as followSvc, unfollow as unfollowSvc } from '../services/user';
import { RequestHandler } from 'express'
import redisClient from '../redisClient';

const follow :RequestHandler = async (req,res,next) => {

    const id = req.user?.id;
    const followId = Number(req.params.id);

    console.log(`사용자 아아디 ${id} 가 ${followId} 를 팔로우 합니다.`);

    try {
        if(id){
            const result = await followSvc(id,followId);
            if(result === 'ok'){
                redisClient.del(`user:${id}`)
                res.send('success');
            } else if (result === 'no user'){
                res.status(404).send('no user');
            }
        }
    } catch (error) {
        console.error('follow 에러',error);
        next(error);
    }
}

const unfollow : RequestHandler = async (req,res,next) => {
    const id = req.user?.id;
    const unfollowId = Number(req.params.id);

    console.log(`${id} 사용자가 ${unfollowId} 를 언팔로우 합니다`);

    try {
        if(id){
            const result = await unfollowSvc(id,unfollowId);
            if(result === 'ok'){
                redisClient.del(`user:${id}`)
                res.send('success');
            } else if (result === 'no user'){
                res.status(404).send('no user');
            }
        }
    } catch (error) {
        console.error(error);
        next(error);
    }
}

export {follow, unfollow}