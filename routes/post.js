const express = require('express');
const router = express.Router();
const { isLoggedIn } = require('../middlewares');
const { afterUploadImage, uploadPost, like, unlike, deletePost, userPost } = require('../controllers/post');
const fs = require('fs');
const multer = require('multer');
const path = require('path');
const multerS3 = require('multer-s3');
const { S3Client } = require("@aws-sdk/client-s3");

const s3 = new S3Client({
    credentials:{
        accessKeyId : process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey : process.env.AWS_SECRET_ACCESS_KEY
    },
    region: process.env.AWS_REGION,
});

try {
    fs.readdirSync('uploads');
} catch (error) {
    fs.mkdirSync('uploads');
}



const upload = multer({
    storage:multerS3({
        s3,
        bucket:'nodebird-study-codingkermit',
        key(req,file,cb){
            cb(null,`original/${Date.now()}_${file.originalname}`);
        }
    }),
    limits:{
        fileSize:50*1024*1024,
        // parts : 10,
        // files : 5,
        // fields : 5,
    },
    // fileFilter(req,file,cb){
    //     console.log('file : ',file);
    //     cb(null,true);
    // },
    /* 
    파일명이 아니라 파일의 경로를 값으로 가지도록 하는 옵션.
    IOS 앱에서는 파일 전체 경로가 전달되는 경우가 있다함. 
    하지만 보안을 위해 일반적으로 경로를 저장하는 것은 보안에 위험하기 때문에 preservePath 옵션은 false 로 사용하는 것이 좋겠다.
    */
    // preservePath : false, 
});


// 파일명의 중복을 방지하기 위해 해쉬화를 하는 것이 목적이라면 아래와 같이 dest 옵션만 사용해도 괜찮겠다. 훨씬 간결해진다.
// const upload = multer({dest:'uploads/'});

// upload.single() 인수로 사용되는 값은 브라우저에서 html 속성 중 name 에 해당하는 값과 일치해야함
router.post('/img', isLoggedIn, upload.single('img'), afterUploadImage);

const upload2 = multer(); // 파일 업로드를 막기 위해서라면 다른 옵션이 불필요
router.post('/', isLoggedIn, upload2.none(),uploadPost);

router.post('/like/:postId',isLoggedIn,like);
router.post('/unlike/:postId',isLoggedIn,unlike);

router.post('/delete/:postId',isLoggedIn,deletePost);

module.exports = router;