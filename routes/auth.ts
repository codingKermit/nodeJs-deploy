import express from 'express';
import passport from 'passport';
import { isNotLoggedIn, isLoggedIn } from '../middlewares';
import { join, login, logout, update } from '../controllers/auth';
const router = express.Router();

router.post('/join',isNotLoggedIn, join);
router.post('/login',isNotLoggedIn, login);
router.get('/logout',isLoggedIn, logout);

router.get('/kakao',passport.authenticate('kakao'));
router.get('/kakao/callback',passport.authenticate('kakao',{
    failureRedirect : '/?loginError=카카오로그인 실패'
}),(req,res)=>{
    res.redirect('/');
});

router.post('/update',isLoggedIn,update)

export default router;