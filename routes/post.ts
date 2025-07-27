import express from 'express';
const router = express.Router();
import { isLoggedIn } from '../middlewares';
import { afterUploadImage, uploadPost, like, unlike, deletePost } from '../controllers/post';
import fs from 'fs';
import multer from 'multer';
import path from 'path';
import multerS3 from 'multer-s3';
import { S3Client } from "@aws-sdk/client-s3";

const s3 = new S3Client({
    credentials:{
        accessKeyId : process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey : process.env.AWS_SECRET_ACCESS_KEY!
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
        key(req : Express.Request,file : Express.Multer.File,cb:(error: any, key?: string)=>void){
            cb(null,`original/${Date.now()}_${file.originalname}`);
        }
    }),
    limits:{
        fileSize:50*1024*1024,
    },
});


router.post('/img', isLoggedIn, upload.single('img'), afterUploadImage);

const upload2 = multer(); 
router.post('/', isLoggedIn, upload2.none(),uploadPost);

router.post('/like/:postId',isLoggedIn,like);
router.post('/unlike/:postId',isLoggedIn,unlike);

router.post('/delete/:postId',isLoggedIn,deletePost);

export default router;