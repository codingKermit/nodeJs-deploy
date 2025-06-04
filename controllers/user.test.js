const {follow,unfollow} = require('./user');
jest.mock('../services/user.js'); // 사용 서비스 모킹
// jest.mock('../models/user.js'); // 사용 모델 모킹
const {follow:followService, unfollow:unfollowService} = require('../services/user');
// const User = require('../models/user'); // 모킹한 모델 임포트

const res = {
    status:jest.fn(()=>res),
    send:jest.fn(),
};
const next = jest.fn()

const req = {
    user:{id:1},
    params:{id:2}
};

describe('follow',()=>{
    test('팔로우를 성공하면 success 를 응답', async () => {
        
        // 모킹한 모델의 findOne 응답 값 모킹
        // User.findOne.mockReturnValue({
        //     addFollowing(id){ // findOne 으로 리턴된 값에서 addFollowing() 함수를 모킹
        //         return Promise.resolve(true); // 응답 true로
        //     }
        // });

        followService.mockReturnValue('ok');

        await follow(req,res,next);
        expect(res.send).toBeCalledWith('success');
    });

    test('user 가 없으면 404 를 응답', async () => {
        // User.findOne.mockReturnValue(null);
        followService.mockReturnValue('no user');
        await follow(req,res,next);
        expect(res.status).toBeCalledWith(404);
        expect(res.send).toBeCalledWith('no user');
    });

    test('error 발생 시 next 에러 응답', async () => {
        const message = 'DB 에러';
        followService.mockReturnValue(Promise.reject(message)); // reject 모킹
        await follow(req, res, next); 
        expect(next).toHaveBeenCalledWith(message);
    });    
})

describe('unfollow',()=>{


    test('언팔로우 성공 시 ok 응답',async ()=>{
        unfollowService.mockReturnValue('ok');
        await unfollow(req,res,next);
        expect(res.send).toHaveBeenCalledWith('success');
    });

    test('사용자가 없으면 no user 응답',async()=>{
        unfollowService.mockReturnValue('no user');
        const result = await unfollow(req,res,next);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.send).toHaveBeenCalledWith('no user');
    });

    test('예외 발생 시 next 에러 응답', async ()=>{
        const message = 'DB 에러';
        unfollowService.mockReturnValue(Promise.reject(message));
        await unfollow(req,res,next);
        expect(next).toHaveBeenCalledWith(message);
    })
})