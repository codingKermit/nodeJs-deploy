const app = require('../app');
const request = require('supertest');
const {sequelize} = require('../models');

beforeAll(async()=>{
    await sequelize.sync({force:true});
});

describe('/',()=>{
    test('메인 접근', () => {
        request(app).get('/')
        .expect('Location','/')
    });
});

describe('/join',()=>{
    test('미로그인 상태로 접근',async()=>{
        request(app).get('/join')
        .expect('Location','/join')
    });

    const agent = request.agent(app);
    beforeEach(async()=>{
        await request(app).post('/auth/join')
        .send({
            email:'test@test.com',
            password:'test'
        })

        await agent.post('/auth/login')
        .send({
            email:'test@test.com',
            password:'test'
        })
    })
    test('로그인 후 접근',async()=>{
        const message = encodeURIComponent('로그인한 상태입니다.');
        agent.get('/join')
        .expect('Location',`/?error=${message}`);
    })
});

describe('/profile',()=>{
    
})


afterAll(async()=>{
    await sequelize.close();
})