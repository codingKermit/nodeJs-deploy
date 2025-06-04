const express = require('express');
const router = express.Router();
const { isLoggedIn } = require('../middlewares');
const { afterUploadImage, uploadPost, like, unlike, deletePost, userPost } = require('../controllers/post');
const fs = require('fs');
const multer = require('multer');
const path = require('path');

try {
    fs.readdirSync('uploads');
} catch (error) {
    fs.mkdirSync('uploads');
}

const upload = multer({
    storage:multer.diskStorage({
        destination(req,file,cb){
            // 파일이 저장될 경로가 유동적이라면 조건에 따라 나눌 수 있다. 하지만 해당하는 디렉토리는 존재해야한다
            cb(null,'uploads/');
        },
        // destination 옵션은 string 을 파라미터로 받을 수 있다. 파일이 업로드 될 디렉토리가 고정적이라면 아래와 같이 사용하여도 무방하다
        // destination:'uploads/',
        filename(req,file,cb){
            // console.log(file);
            const ext = path.extname(file.originalname); // 확장자
            
            // path.basename() 의 결과 비교 확인용 로그
            console.log('basename with 1 params : ', path.basename(file.originalname)); // 확장자가 제거되지 않은 파일명 반환 
            console.log('basename with 2 params : ', path.basename(file.originalname,ext)); // 확장자가 제거된 파일명 반환

            cb(null,path.basename(file.originalname,ext)+Date.now()+ext);
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