const express = require('express');
const { renderMain, renderJoin, renderProfile, renderHashtag, renderUpdate } = require('../controllers/page');
const { isLoggedIn, isNotLoggedIn } = require('../middlewares');
const router = express.Router();

router.use((req,res,next)=>{

    // console.log('user : ' , req.user);

    res.locals.user = req.user;
    res.locals.followerCount = req.user?.Followers?.length || 0;
    res.locals.followingCount = req.user?.Followings?.length || 0;
    res.locals.followingIdList = req.user?.Followings.map(f => f.id) || [];

    // console.log('locals : ',res.locals);

    // res.locals 에 저장한 값은 이번 요청에 대해서만 값을 보존
    // req.session은 사용자가 로그아웃하기 전까지 값을 보존
    req.session.data = 'test';
    next();
})

router.get('/',renderMain);
router.get('/join', isNotLoggedIn ,renderJoin);
router.get('/profile', isLoggedIn ,renderProfile);
router.get('/update', isLoggedIn ,renderUpdate);
router.get('/hashtag',renderHashtag);

module.exports = router;