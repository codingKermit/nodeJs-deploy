const Post = require('../models/post');
const HashTag = require('../models/hashtag');
const multer = require('multer');
const User = require('../models/user');
const userCache = require('../passport/cache');

exports.afterUploadImage = (req,res)=>{
    console.log(req.file);

    res.json({url:`/img/${req.file.filename}`});
}

exports.uploadPost = async (req,res,next)=>{
    // 클라이언트에서 전달되는 값은 content와 url
    // 즉 req.body.url, req.body.content 를 사용함

    try {
        console.log('user',req.user);

        const post = await Post.create({
            content : req.body.content,
            img : req.body.url,
            UserId: req.user.id
        });

        const hashtags = req.body.content.match(/#[^\s#]*/g);

        if(hashtags){
            


            /*
                findOrCreate() 는 Promise를 반환하기 때문에
                await 하지 않고 Promise 객체를 생성.
                생성된 Promise를 return 하여 map으로 새로운 배열 생성.
                생성된 Promise 배열을 Promise.all() 을 통해 실제 요청 수행
            */
            const result = await Promise.all(
                hashtags.map((hashtag)=>{
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

exports.like = async (req,res,next) =>{
    const id = req.user.id;
    const postId = req.params.postId;
    console.log('userId :', id);
    console.log('postId : ',postId);
    console.log(`${id} 사용자가 ${postId} 를 좋아요합니다.`);

    const user = await User.findOne({where:{id}});
    // const post = await Post.findByPk(postId);

    await user.addTwit(postId)
    .then((result)=>{
        console.log('follow result : ',result);
        delete userCache[id];
        res.send(true);
    })
    .catch((error)=>{
        console.error(error);
        next(error);
    })
}

exports.unlike = async (req,res,next) =>{
    console.log('userId :', req.user.id);
    console.log('postId : ',req.params.postId);
    console.log(`${req.user.id} 사용자가 ${req.params.postId} 를 좋아요 취소 합니다.`);
    
    const id = req.user.id;
    
    const postId = req.params.postId;
    const user = await User.findOne({where:{id}});
    
    await user.removeTwit(postId)
    .then((result)=>{
        console.log('unfollow result : ',result);
        delete userCache[id];
        res.send(true);
    })
    .catch((err)=>{
        console.error(err);
        next(err);
    })
}

exports.deletePost = async (req,res,next) =>{
    console.log('post ID : ',req.params.postId);
    console.log('user ID : ',req.user.id);

    const userId = req.user.id;
    const postId = req.params.postId;
    
    console.log(`${userId}님이 ${postId} 게시글을 삭제합니다`);
    
    try {
        /*
        방법 1. 작성자 ID, 게시글 ID를 사용해 바로 삭제
        DB에 한번만 요청을 보내지만 삭제 조건이 복잡해지면 where 조건이 복잡해질 가능성이 있음
        */
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
        
        /*
        방법2. user를 찾아서 게시글을 삭제하는 방법.
        DB에 두번 요청을 보내지만 where 조건에 대해 고려할 부분이 적음
        */
        // const user = await User.findOne({where:{id:userId}});
        // await user.deletePost(postId)
        // .then((result)=>{
        //     console.log('delete post result : ', result);
        //     res.send(true);
        // })
        // .catch((err)=>{
        //     console.error(err);
        //     next(err);
        // })
    } catch (error) {
        console.error(error);
        next(error);
    }
}