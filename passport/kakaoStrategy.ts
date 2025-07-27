import passport from 'passport';
import { Strategy as KakaoStrategy } from 'passport-kakao';
import User from '../models/user';
import logger from '../logger.js';

export default () =>{
    passport.use(new KakaoStrategy({
        clientID: process.env.KAKAO_ID!,
        callbackURL: process.env.KAKAO_CALLBACK!,
    },async (accessToken : string,refreshToken : string, profile,done)=>{
        try {
            const exUser = await User.findOne({where:{snsId : profile.id, provider:'kakao'}});
            if(exUser){
                exUser.accessToken = accessToken;
                done(null,exUser);
            } else {
                const newUser = await User.create({
                    email : profile._json.kakao_account?.email,
                    nickname : profile.displayName, 
                    provider : 'kakao',
                    snsId : profile.id
                });
                newUser.accessToken = accessToken
                done(null,newUser);
            }
        } catch (error) {
            console.error(error);
            done(error);
        }
    }));
}