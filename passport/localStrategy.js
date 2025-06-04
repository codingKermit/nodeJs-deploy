const passport = require('passport');
const User = require('../models/user');
// const LocalStrategy = require('passport-local').Strategy;
const {Strategy : LocalStrategy} = require('passport-local'); // 위 라인의 방법과 결과는 동일하며 구조분해할당 사용하는 방법
const bcrypt = require('bcrypt');

module.exports = () => {
    passport.use(new LocalStrategy({
        usernameField : 'email', // req.body.email 을 유저 아이디로 받음
        passwordField : 'password', // req.body.password 를 유저 비밀번호로 받음
        passReqToCallback : false, // true 설정시 VerifyFunction 의 첫번째 인자로 요청 객체(request) 가 추가됨 ex) async(req,email,password,done)
        session : true // 로그인 정보를 세션에 저장해서 로그인 상태를 유지할지 여부. 기본값은 true. *interface에서는 undefined 라고 하지만 
    },async(email, password, done)=>{ // (아이디, 비밀번호, done) 를 고정적으로 받음. *interface 확인
        try {
            const exUser = await User.findOne({where:{email}});
            if(exUser){
                const result = await bcrypt.compare(password,exUser.password);
                if(result){
                    done(null,{user:exUser}); 
                } else {
                    done(null, false, {message:'비밀번호 불일치'})
                }
            } else {
                done(null, false, {message:'미가입 회원'})
            }
        } catch (error) {
            console.error(error);
            done(error);
        }
    }));
}