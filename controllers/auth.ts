import { RequestHandler } from 'express';
import User from "../models/user";
import bcrypt from 'bcrypt';
import passport,{ AuthenticateCallback } from 'passport';
import redisClient from '../redisClient';

const join:RequestHandler = async (req,res,next) => {
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

const login:RequestHandler = (req,res,next) => {

    const callback : AuthenticateCallback = (authError, user, info)=>{
        if(authError){ // 서버 에러
            console.error(authError);
            next(authError);
        }

        if(!user){ // 로직 실패
            const errorMsg = typeof info === 'object' && info !== null && 'message' in info
                ? (info as { message: string }).message
                : '정의되지 않은 에러';
            return res.redirect(`/?loginError${errorMsg}`);
        }

        return req.login(user, (loginError)=>{
            if(loginError){
                console.error(loginError);
                return next(loginError);
            }
            return res.redirect('/');
        })
    }
    
    passport.authenticate('local',callback)(req,res,next);
}

const logout:RequestHandler = async (req,res,next) => {
    const accessToken = req.user?.accessToken;

    if(accessToken){
        await fetch('https://kapi.kakao.com/v1/user/logout',{
            method:'POST',
            headers:{
                'Content-Type' : 'application/x-www-form-urlencoded;charset=utf-8',
                'Authorization' : `Bearer ${accessToken}`
            },
        })
        .then((res)=>{
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

const update:RequestHandler = async (req,res,next) => {
    const id = req.user?.id;

    const user = await User.findOne({where:{id}});

    const nickname = req.body.nickname;

    await user?.update({
        nickname
    })
    .then(async (result)=>{
        if(id){
            await redisClient.del(`user:${id}`)
        }
        req.logout(()=>{
            res.redirect('/');
        });
    })
    .catch((err)=>{
        console.error(err);
        next(err);
    })
}

export {join, login,logout,update}