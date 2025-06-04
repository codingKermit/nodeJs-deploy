const passport = require('passport');
const { Strategy : KakaoStrategy } = require('passport-kakao');
const User = require('../models/user');

module.exports = () =>{
    passport.use(new KakaoStrategy({
        clientID: process.env.KAKAO_ID,
        callbackURL: process.env.KAKAO_CALLBACK,
        // kakao developers > 내 애플리케이션 > 제품 설정 > 카카오 로그인 > 보안 에서 생성&확인 가능
        // clientSecret: '', 
        
        // 공식 문서를 찾아봤지만 아직 내용 확인 불가
        // GPT : OAuth 요청 URL에 권한 목록의 구분자를 지정하는 옵션
        // scopeSeparator: '', 
        
        // 공식 문서를 찾아봤지만 아직 내용 확인 불가
        // GPT : 커스텀 헤더를 설정. 인터페이스에서는 string이라고 되어있지만 Map 객체를 받음
        // customHeaders: ''
    },async (accessToken,refreshToken,profile,done)=>{
        // console.log('profile :',profile);
        try {
            const exUser = await User.findOne({where:{snsId : profile.id, provider:'kakao'}});
            if(exUser){
                done(null,{user:exUser, accessToken});
            } else {
                const newUser = await User.create({
                    email : profile._json.kakao_account?.email,
                    nickname : profile.displayName, 
                    provider : 'kakao',
                    snsId : profile.id
                });
                done(null,{user:newUser, accessToken});
            }
        } catch (error) {
            console.error(error);
            done(error);
        }
    }));
}