import express from 'express';
import { renderMain, renderJoin, renderProfile, renderHashtag, renderUpdate } from '../controllers/page';
import { isLoggedIn, isNotLoggedIn } from '../middlewares';
const router = express.Router();

router.use((req,res,next)=>{
    // console.log('req.user : ',req.user)
    res.locals.user = req.user;
    res.locals.followerCount = req.user?.Followers?.length || 0;
    res.locals.followingCount = req.user?.Followings?.length || 0;
    res.locals.followingIdList = req.user?.Followings?.map(f => f.id) || [];
    next();
})

router.get('/',renderMain);
router.get('/join', isNotLoggedIn ,renderJoin);
router.get('/profile', isLoggedIn ,renderProfile);
router.get('/update', isLoggedIn ,renderUpdate);
router.get('/hashtag',renderHashtag);

export default router;