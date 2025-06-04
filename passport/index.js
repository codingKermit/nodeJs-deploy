const passport = require('passport');
const local = require('./localStrategy');
const kakao = require('./kakaoStrategy');
const User = require('../models/user');

const userCache = require('./cache');

module.exports = () => {
    passport.serializeUser((user, done)=>{ // req.login 할 때 호출
        console.log('user : ',user);
        const id = user.user.id;
        const accessToken = user.accessToken;
        console.log('id',id);
        console.log('accessToken',accessToken);
        done(null,{id,accessToken});
    })

    passport.deserializeUser((user, done)=>{ // 로그인한 사용자의 모든 호출에서 사용
        const id = user.id;
        console.log('id :',id);

        const cacheUser = userCache[id];

        if(cacheUser){
            console.log('캐싱된 사용자는 캐싱 데이터를 제공합니다');
            done(null,cacheUser);
            return;
        }
        
        User.findOne({
            where:{id},
            include:[
                {
                    model : User,
                    attribute:['id','nickname'],
                    as : 'Followers'
                },
                {
                    model : User,
                    attribute:['id','nickname'],
                    as : 'Followings'
                },
            ]
        })
        .then((user)=>{
            // console.log('user : ',user);
            // console.log('user.Followers : ',user.Followers);
            // console.log('user.Followers.length : ',user.Followers.length);
            // console.log('user.Followings : ',user.Followings);
            // console.log('user.Followings.length : ',user.Followings.length);

            console.log('캐싱 되지 않은 사용자는 신규 캐싱합니다')
            userCache[id] = user;
            done(null,user)
        })
        .catch((err)=>{
            done(err);
        })
    })

    local();

    kakao();
}