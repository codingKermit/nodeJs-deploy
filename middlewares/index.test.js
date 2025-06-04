const {isLoggedIn, isNotLoggedIn} = require('./index');

// 성공 예시
test('1+1은 2입니다.',()=>{
    expect(1+1).toEqual(2);
});

// 실패 하는 예시
// test('1+1은 2입니다.',()=>{
//     expect(1+1).toEqual(3);
// });

describe('isLoggedIn',() => {
    const res = {
        status:jest.fn(()=>res), // 메서드 체이닝을 위해 res 반환
        send:jest.fn()
    };
    const next = jest.fn();

    test('로그인 되어있으면 isLoggedIn이 next() 호출',()=>{
        const req = {
            isAuthenticated:jest.fn(()=>true) // 인증 성공을 전제로 하기 때문에 true 반환
        };
        isLoggedIn(req,res,next);
        expect(next).toBeCalledTimes(1);
    });

    test('로그인 되어있지 않으면 isLoggedIn이 에러를 응답',()=>{
        const req = {
            isAuthenticated:jest.fn(()=>false) // 인증 실패를 전제로 하기 때문에 false 반환
        };
        isLoggedIn(req,res,next);
        expect(res.status).toBeCalledWith(403);
        expect(res.send).toBeCalledWith('로그인 필요');
    });
})

describe('isNotLoggedIn',()=>{
    const res = {
        status:jest.fn(()=>res), // 메서드 체이닝을 위해 res 반환
        send:jest.fn(),
        redirect:jest.fn()
    };
    const next = jest.fn();

    test('로그인 되어있지 않으면 isNotLoggedIn이 next() 호출',()=>{
        const req = {
            isAuthenticated:jest.fn(()=>false) // 인증 실패를 전제로 하기 때문에 false 반환
        };
        isNotLoggedIn(req,res,next);
        expect(next).toBeCalledTimes(1);
    });

    test('로그인 되어있으면 isNotLoggedIn이 에러를 응답',()=>{
        const req = {
            isAuthenticated:jest.fn(()=>true) // 인증 성공을 전제로 하기 때문에 true 반환
        };
        const message = encodeURIComponent('로그인한 상태입니다.');
        isNotLoggedIn(req,res,next);
        expect(res.redirect).toBeCalledWith(`/?error=${message}`);
    });
})