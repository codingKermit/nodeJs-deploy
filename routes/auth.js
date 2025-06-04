const express = require('express');
const passport = require('passport');
const { isNotLoggedIn, isLoggedIn } = require('../middlewares');
const { join, login, logout, passwordCheck, update } = require('../controllers/auth');
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

module.exports = router;