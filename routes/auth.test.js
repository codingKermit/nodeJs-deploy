const app = require('../app');
const request = require('supertest');
const {sequelize} = require('../models');

// 테스트 수행 전 한번
beforeAll(async()=>{
    // {force:true} 는 매번 DB를 새로 만들어버리는데 트랜잭션으로 처리하는 방법을 찾아보자
    await sequelize.sync({force:true});
    // await sequelize.sync();
})

describe('POST /join',()=>{
    test('로그인 안했으면 가입',(done)=>{
        request(app).post('/auth/join')
        .send({
            email:'woojw6012@gmail.com',
            password:'test',
            nickname:'test'
        })
        .expect('Location','/')
        .expect(302,done);
    })

    test('중복 회원가입',(done)=>{
        request(app).post('/auth/join')
        .send({
            email:'woojw6012@gmail.com',
            password:'test',
            nickname:'test'
        })
        .expect('Location','/join?error=exist')
        .expect(302,done)
    })


})

describe('POST /join',()=>{
    const agent = request.agent(app);
    beforeEach((done)=>{
        agent.post('/auth/login')
        .send({
            email:'woojw6012@gmail.com',
            password:'test'
        })
        .end(done);
    })
    test('로그인 한 상태에서 회원가입 시도',(done)=>{
        const message = encodeURIComponent('로그인한 상태입니다.');
        agent.post('/auth/join')
        .send({
            email:'woojw6012@gmail.com',
            password:'test'
        })
        .expect('Location',`/?error=${message}`)
        .expect(302,done)
    });
})

describe('POST /login',()=>{
    test('로그인 수행',(done)=>{
        request(app).post('/auth/login')
        .send({
            email:'woojw6012@gmail.com',
            password:'test'
        })
        .expect('Location','/')
        .expect(302,done);
    })

    test('비밀번호 오기입',(done)=>{
        const message = encodeURIComponent('비밀번호 불일치');

        request(app).post('/auth/login')
        .send({
            email:'woojw6012@gmail.com',
            password:'falsedPassword'
        })
        .expect('Location',`/?loginError${message}`)
        .expect(302,done);
    })

    test('미가입 회원',(done)=>{
        const message = encodeURIComponent('미가입 회원');

        request(app).post('/auth/login')
        .send({
            email:'hermit@naver.com',
            password:'test'
        })
        .expect('Location',`/?loginError${message}`)
        .expect(302,done);
    })
});

describe('GET /logout',()=>{
    test('로그인 되어있지 않으면 403', (done) => {
        // request(app) 을 통해 로그인 하지 않은 상태를 유지
        request(app)
            .get('/auth/logout')
            .expect(403,done);
    });
    
    // agent() 를 통해 재사용
    const agent = request.agent(app);
    beforeEach((done)=>{
        agent.post('/auth/login')
        .send({
            email:'woojw6012@gmail.com',
            password:'test'
        })
        .end(done);
    });
    test('로그아웃 수행',(done)=>{
        agent.get('/auth/logout')
        .expect('Location','/')
        .expect(302,done);
    })
})

// 모든 테스트가 끝난 후 동작
afterAll(async()=>{
    await sequelize.close();
    // await sequelize.sync({force:true});
});