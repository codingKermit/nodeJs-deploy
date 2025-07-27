import Hashtag from '../models/hashtag';
import Post from '../models/post';
import User from '../models/user';
import {Sequelize} from 'sequelize';
import AWS from 'aws-sdk';
import { RequestHandler } from 'express';

const s3 = new AWS.S3();

const renderMain : RequestHandler = async (req,res,next) => {
    // console.log('session : ',req.session);

    const userId = req.user?.id ?? 0;

    const query = req.query;

    const sType = query?.s_type;
    const sKeyword = query?.s_keyword;

    const where :any = {};

    if(sType && typeof sType == 'string') {
        where[sType] = sKeyword;
    }

    try {
        const posts = await Post.findAll({
            order:[['createdAt','DESC']],
            include:[{
                model:User,
                attributes:['id','nickname']
            },
            ],
            attributes:[
                'content',
                'img',
                'id',
                [Sequelize.literal(`(
                    SELECT count(*) FROM TwitLike 
                    WHERE TwitLike.PostId = Post.Id
                    AND TwitLike.UserId = ${userId}
                ) > 0`),
                'liked'
            ]
            ],
            where
        });

        posts.map(post => {
            if(post.img){
                const url = new URL(post.img);
                const path = url.pathname.slice(1);
                const imageUrl = getPresignedImageUrl(path);
                post.imgUrl = imageUrl;
            }
        })

        res.render('main',
            {
                title:'NodeBird',
                twits:posts
            }
        )
    } catch (error) {
        console.error('메인 에러',error);
    }
};

const renderJoin : RequestHandler = (req,res,next) => {
    res.render('join',{title:'회원 가입 - NodeBird'});
};

const renderProfile :RequestHandler = (req,res,next) => {
    res.render('profile',{title:'내 정보 - NodeBird'});
};

const renderUpdate : RequestHandler = (req,res,next)=>{
    res.render('update',{title:'회원정보 업데이트 - NodeBird'})
}

const renderHashtag : RequestHandler = async (req,res,next) => {
    console.log('hashtag : ',req.query.hashtag);
    const query = req.query.hashtag;

    if(!query){
        res.redirect('/');
    } else {
        const hashtag = await Hashtag.findOne({
            where:{
                title : query as string
            }
        })

        const posts = await hashtag?.getPosts() ?? [];

        res.render('main',{
            title:`${query}`,
            twits : posts
        });
    }
}

function getPresignedImageUrl(key : string) {
  return s3.getSignedUrl('getObject', {
    Bucket: 'nodebird-study-codingkermit',
    Key: key,
    Expires: 300,
  });
}

export {renderMain,renderHashtag,renderJoin,renderProfile,renderUpdate}