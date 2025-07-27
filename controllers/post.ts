import Post from '../models/post';
import HashTag from '../models/hashtag';
import multer from 'multer';
import User from '../models/user';
import { RequestHandler } from 'express';
import redisClient from '../redisClient';

interface MulterS3File extends Express.Multer.File {
    location?: string;
}

const afterUploadImage :RequestHandler= (req,res)=>{
    const file = req.file as MulterS3File;
    const originalUrl = file?.location;
    const url = originalUrl?.replace(/\/original\//,'/thumb/');
    res.json({url, originalUrl});
}

const uploadPost :RequestHandler = async (req,res,next)=>{

    try {
        const post = await Post.create({
            content : req.body.content,
            img : req.body.url,
            UserId: req.user?.id
        });

        const hashtags = req.body.content.match(/#[^\s#]*/g);

        if(hashtags){
            
            const result = await Promise.all(
                hashtags.map((hashtag:string)=>{
                    return HashTag.findOrCreate({
                        where :{
                            title : hashtag.slice(1).toLowerCase()
                        }
                    })
                })
            );

            console.log('result',result);

            await post.addHashtags(result.map(r => r[0]));
        }

        res.redirect('/');
    } catch (error) {
        console.error(error);
        next(error);
    }
}

const like : RequestHandler = async (req,res,next) =>{
    const id = req.user?.id;
    const postId = Number(req.params.postId);
    console.log('userId :', id);
    console.log('postId : ',postId);
    console.log(`${id} 사용자가 ${postId} 를 좋아요합니다.`);

    const user = await User.findOne({where:{id}});

    if(user){
        await user.addTwit(postId)
        .then((result)=>{
            console.log('follow result : ',result);
            redisClient.del(`user:${id}`)
            res.send(true);
        })
        .catch((error)=>{
            console.error(error);
            next(error);
        })
    }
}

const unlike :RequestHandler = async (req,res,next) =>{
    console.log(`${req.user?.id} 사용자가 ${req.params.postId} 를 좋아요 취소 합니다.`);
    
    const id = req.user?.id;
    
    const postId = Number(req.params.postId);
    const user = await User.findOne({where:{id}});
    
    if(user){
        await user.removeTwit(postId)
        .then((result)=>{
            console.log('unfollow result : ',result);
            redisClient.del(`user:${id}`)
            res.send(true);
        })
        .catch((err:any)=>{
            console.error(err);
            next(err);
        })
    }
}

const deletePost :RequestHandler = async (req,res,next) =>{
    const userId = req.user?.id;
    const postId = req.params.postId;
    
    console.log(`${userId}님이 ${postId} 게시글을 삭제합니다`);
    
    try {
        await Post.destroy({
            where:{
                id:postId,
                UserId:userId
            }
        })
        .then((result)=>{
            console.log('delete post result : ',result);
            res.send(true);
        })
        .catch((err)=>{
            console.error(err);
            next(err);
        })
        
    } catch (error) {
        console.error(error);
        next(error);
    }
}

export { afterUploadImage, uploadPost, like, unlike, deletePost }