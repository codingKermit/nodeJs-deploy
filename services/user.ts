import redisClient from '../redisClient'

import User from '../models/user';

const follow = async (id:number, followId:number)=>{
    const user = await User.findOne({where:{id}});
    const targetUser = await User.findOne({where:{id:followId}})
    if(user && targetUser){
        await user.addFollowing(targetUser);
        redisClient.del(`user:${id}`);
        return 'ok';
    } else {
        return 'no user';
    }
}

const unfollow = async (id:number,unfollowId:number) => {
    const user = await User.findOne({where:{id}});
    const targetUser = await User.findOne({where:{id:unfollowId}});
    if(user && targetUser){
        await user.removeFollowings(targetUser);
        return 'ok';
    } else {
        return 'no user';
    }
}

export {follow, unfollow}