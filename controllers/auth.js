const User = require("../models/user");
const bcrypt = require('bcrypt');
const passport = require('passport');
const userCache = require('../passport/cache');

exports.join = async (req,res,next) => {
    const {nickname, email, password} = req.body;
    try {
        const user = await User.findOne({where:{email}});
        if(user){
            return res.redirect('/join?error=exist');
        }

        const hash = await bcrypt.hash(password, 12);

        await User.create({
            email,
            nickname,
            password : hash // 비밀번호는 암호화한 비밀번호로 저장
        });

        return res.redirect('/');
    } catch (error) {
        console.error(error);
        next(error);
    }
    next();
}

exports.login = (req,res,next) => {
   
    // passport 가 local 전략을 찾아 passport-local 을 구현한 기능을 호출.
    // 지금 구조에서는 /passport/localStrategy.js 에서 passport-local 을 만들고 있기 때문에 이를 실행 시킴
    // authenticate의 두 번째 파라미터 콜백 함수는 구현된 함수 내의 done() 에서 리턴해주는 값
    passport.authenticate('local',(authError, user, info)=>{
        if(authError){ // 서버 에러
            console.error(authError);
            next(authError);
        }

        if(!user){ // 로직 실패
            return res.redirect(`/?loginError${info.message}`);
        }

        return req.login(user, (loginError)=>{
            if(loginError){
                console.error(loginError);
                return next(loginError);
            }
            return res.redirect('/');
        })
    })(req,res,next);
}

exports.logout = async (req,res,next) => {
    // console.log('session : ',req.session);
    // console.log('body : ', req.body);
    // console.log('accessToken : ', req.session.passport.user?.accessToken);
    
    const accessToken = req.session.passport.user?.accessToken;

    console.log('accessToken',accessToken);
    if(accessToken){
        await fetch('https://kapi.kakao.com/v1/user/logout',{
            method:'POST',
            headers:{
                'Content-Type' : 'application/x-www-form-urlencoded;charset=utf-8',
                'Authorization' : `Bearer ${accessToken}`
            },
        })
        .then((res)=>{
            console.log('res : ',res);
            if(res.status !== 200){

            }
        })
        .catch((err)=>{
            console.error(err);
        })
    }

    req.logout(()=>{
        res.redirect('/');
    })
}

exports.update = async (req,res,next) => {
    console.log('nickname : ' , req.body.nickname);

    const id = req.user.id;

    const user = await User.findOne({where:{id}});

    const nickname = req.body.nickname;

    await user.update({
        nickname
    })
    .then(async (result)=>{
        console.log('result',result);

        // 회원정보 변경 시 캐싱 제거
        delete userCache[id];
        req.logout(()=>{
            res.redirect('/');
        });
    })
    .catch((err)=>{
        console.error(err);
        next(err);
    })
}