const app = require('../app');
const request = require('supertest');
const {sequelize} = require('../models');
const User = require('../models/user');

beforeAll(async()=>{
    // await sequelize.sync();
    await sequelize.sync({force:true});

    await request(app).post('/auth/join')
    .send({
        email:'hermit@kakao.com',
        password:'test',
        nickname:'test'
    })
    await request(app).post('/auth/join')
    .send({
        email:'hermit@gmail.com',
        password:'test',
        nickname:'test'
    })
})

afterAll(async()=>{
    await sequelize.close();
    // await sequelize.sync({force:true})
})

describe('/:id/follow',()=>{
    test('로그인 하지 않은 상태에서 팔로우 시도',(done)=>{
        request(app).post('/user/2/follow')
        .expect(403, done);
    });

    const agent = request.agent(app);

    beforeEach((done)=>{
        agent.post('/auth/login')
        .send({
            email:'hermit@kakao.com',
            password:'test'
        })
        .end(done);
    });

    test('존재하지 않는 사용자를 팔로우', (done) => {
        agent.post('/user/999/follow')
        .expect(404,done);
    });

    test('팔로우', async () => {
        const user = await User.findOne({where:{email:"hermit@gmail.com"}})
        await agent.post(`/user/${user.id}/follow`)
        .expect(200);
    });
})

describe('/:id/unfollow',()=>{
    test('로그인 하지 않은 상태에서 언팔로우 시도', (done) => {
        request(app).post('/user/2/unfollow')
        .expect(403, done);
    });

    const agent = request.agent(app);

    beforeEach((done)=>{
        agent.post('/auth/login')
        .send({
            email:'hermit@kakao.com',
            password:'test'
        })
        .end(done);
    });

    test('존재하지 않는 사용자를 언팔로우', (done) => {
        agent.post('/user/999/unfollow')
        .expect(404,done);
    });

    test('언팔로우', async () => {
        const user = await User.findOne({where:{email:"hermit@gmail.com"}})
        await agent.post(`/user/${user.id}/unfollow`)
        .expect(200);
    });

})

