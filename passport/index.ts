import passport from 'passport'
import local from './localStrategy'
import kakao from './kakaoStrategy'
import User from '../models/user'
import redisClient from '../redisClient';

export default () => {
    passport.serializeUser((user, done)=>{ // req.login 할 때 호출
        console.log('serializeUser user :',user)
        const id = user.id;
        const accessToken = user.accessToken;
        done(null,{id,accessToken});
    })

    passport.deserializeUser(async (user : User, done)=>{ // 로그인한 사용자의 모든 호출에서 사용
        const id = user.id;

        const cachedUser = await redisClient.get(`user:${id}`);

        console.log('cachedUser : ',cachedUser)

        if(cachedUser){
            const cachedUserObj = buildUserWithRelations(JSON.parse(cachedUser))
            done(null,cachedUserObj);
            return;
        }
        
        User.findOne({
            where:{id},
            include:[
                {
                    model : User,
                    attributes:['id','nickname'],
                    as : 'Followers'
                },
                {
                    model : User,
                    attributes:['id','nickname'],
                    as : 'Followings'
                },
            ]
        })
        .then(async (user)=>{
            await redisClient.set(`user:${id}`, JSON.stringify(user),{
                expiration:{
                    type:"EX",
                    value:3600
                }
            });
            console.log('Followers : ', user?.Followers)
            console.log('Followings : ', user?.Followings)
            done(null,user)
        })
        .catch((err)=>{
            console.error(err)
            done(err);
        })
    })

    local();

    kakao();
}

function buildUserWithRelations(json: any): User {
  const { Followers = [], Followings = [], ...userData } = json;

  const user = User.build(userData);

  (user as any).Followers = Followers.map((f: any) => User.build(f));
  (user as any).Followings = Followings.map((f: any) => User.build(f));

  return user;
}