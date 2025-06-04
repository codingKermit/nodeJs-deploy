const User = require('../models/user');
const userCache = require('../passport/cache');

exports.follow = async (id, followId)=>{
    const user = await User.findOne({where:{id}});
    const targetUser = await User.findOne({where:{id:followId}})
    if(user && targetUser){
        await user.addFollowing(targetUser);
        delete userCache[id];
        return 'ok';
    } else {
        return 'no user';
    }
}

exports.unfollow = async (id,unfollowId) => {
    const user = await User.findOne({where:{id}});
    const targetUser = await User.findOne({where:{id:unfollowId}});
    if(user && targetUser){
        await user.removeFollowings(targetUser);
        return 'ok';
    } else {
        return 'no user';
    }
}