jest.mock('../models/user.js');
const User = require('../models/user');
const { follow,unfollow } = require('./user');

describe('follow', () => {
    test('follow 성공 시 ok 반환', async () => {
        const id = 1;
        const followId = 2;

        User.findOne.mockReturnValue({
            addFollowing(id){
                return Promise.resolve(true);
            }
        })
        const result = await follow(id, followId);
        expect(result).toEqual('ok');
    });

    test('사용자가 없으면 no user 반환', async () => {
        const id = 3; // 없는 사용자 ID
        const followId = 2;
        User.findOne.mockReturnValue(null);
        const result = await follow(id, followId);
        expect(result).toEqual('no user');
    });
});

describe('unfollow', () => {
    test('unfollow 성공 시 ok 반환', async() => {
        const id = 1;
        const unfollowId = 2;
        User.findOne.mockReturnValue({
            removeFollowings(unfollowId){
                return Promise.resolve(true);
            }
        });
        const result = await unfollow(id,unfollowId);
        expect(result).toBe('ok');
    });

    test('사용자가 없으면 no user 반환', async() => {
        const id = 3; // 없는 사용자 ID
        const unfollowId = 2;
        User.findOne.mockReturnValue(null);
        const result = await unfollow(id,unfollowId);
        expect(result).toBe('no user');
    });
});