const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const path = require('path');
const session = require('express-session');
const nunjucks = require('nunjucks');
const dotenv = require('dotenv');
const models = require('./models');
const sequelize = models.sequelize;
const passport = require('passport');
const passportConfig = require('./passport');
const helmet = require('helmet');
const hpp = require('hpp');
const redis = require('redis');
const RedisStore = require('connect-redis')(session);

dotenv.config();
const redisClient = redis.createClient({
    url:`redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
    password : process.env.REDIS_PASSWORD,
    legacyMode: true
});

redisClient.connect().catch(console.error);
const pageRouter = require('./routes/page');
const authRouter = require('./routes/auth');
const postRouter = require('./routes/post');
const userRouter = require('./routes/user');

const sessionOption = {
    resave:false,
    saveUninitialized:false,
    secret:process.env.COOKIE_SECRET,
    cookie:{
        httpOnly:true,
        secure:false
    },
    store: new RedisStore({client:redisClient})
}

const app = express();
passportConfig();

app.set('port',process.env.PORT || 8001);
app.set('view engine','html');
nunjucks.configure('views',{
    express: app,
    watch : true
});

sequelize.sync({force:false})
.then(()=>{
    console.log('연결 성공');
})
.catch((err)=>{
    console.error(err);
})

if(process.env.NODE_ENV === 'production'){
    app.use(morgan('combined'));
    sessionOption.proxy = true;
    // https 적용이 되었다면 아래 값이 true
    // sessionOption.cookie.secure = true;

    app.enable('truest proxy');
    app.use(helmet({
        contentSecurityPolicy:false,
        crossOriginEmbedderPolicy:false,
        crossOriginResourcePolicy:false
    }));
    app.use(hpp());
} else {
    app.use(morgan('dev'));
}
app.use(express.static(path.join(__dirname,'public')));

/* app.use() 첫 번째 파라미터 -> 적용할 url, 두 번째 파라미터 -> 적용할 미들웨어
코드 해석 : /img 경로는 express.static 을 사용하여 정적 콘텐츠 접근을 허용
*/
app.use('/img',express.static(path.join(__dirname,'uploads')));
app.use(express.json()); // ajax json 요청을 req.body 에 저장
app.use(express.urlencoded({extended:false})); // formData 를 req.body 에 저장
app.use(cookieParser(process.env.COOKIE_SECRET));

app.use(session(sessionOption));


/**
 * session 설정 이후에 passport 사용 설정
 * 라우터보다는 먼저 사용되어야함.
 */
app.use(passport.initialize()); // req.user, req.login, req.logout req.isAuthticate 함수 생성
app.use(passport.session()); // connect.sid 이름으로 세션 쿠키를 클라이언트로 전달


app.use('/',pageRouter);
app.use('/auth',authRouter);
app.use('/post',postRouter);
app.use('/user',userRouter);

app.use((req,res,next)=>{
    const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
    error.status = 404;
    next(error);
})

app.use((err,req,res,next)=>{
    res.locals.message = err.message;
    res.locals.error = process.env.NODE_ENV !== 'production' ? err : {};
    res.status(err.status || 500);
    res.render('error');
})


module.exports = app;