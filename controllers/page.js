const Hashtag = require('../models/hashtag');
const Post = require('../models/post');
const User = require('../models/user');
const {Sequelize} = require('sequelize');

exports.renderMain = async (req,res,next) => {
    // console.log('session : ',req.session);

    const userId = req.user?.id ?? 0;

    const query = req.query;

    const sType = query?.s_type;
    const sKeyword = query?.s_keyword;

    const where = {};

    if(sType) where[sType] = sKeyword;

    console.log('where : ',where);

    const posts = await Post.findAll({
        order:[['createdAt','DESC']],
        include:[{
            model:User,
            attributes:['id','nickname']
        },
        // 게시글 별 좋아요 목록을 전부 가져오는 것보다 좋아요 여부만 가져오는 것이 빠를 것 같다.
        // 데이터가 많은 경우의 속도 비교 테스트는 아직 못해봄
        // {
        //     model:User,
        //     as : 'Twitter',
        //     through:{
        //         attributes:['UserId','PostId']
        //     },
        // }
        ],
        attributes:[
            'content',
            'img',
            'id',
            // 아래의 리터럴 쿼리문을 'liked' 라는 이름으로 사용
            [Sequelize.literal(`(
                SELECT count(*) FROM TWITLIKE 
                WHERE TWITLIKE.POSTID = POST.ID
                AND TWITLIKE.USERID = ${userId}
            ) > 0`),
            'liked'
        ]
        ],
        where
    });

    res.render('main',
        {
            title:'NodeBird',
            twits:posts
            // twits:[]
        }
    )
};

exports.renderJoin = (req,res,next) => {
    res.render('join',{title:'회원 가입 - NodeBird'});
};

exports.renderProfile = (req,res,next) => {
    res.render('profile',{title:'내 정보 - NodeBird'});
};

exports.renderUpdate = (req,res,next)=>{
    res.render('update',{title:'회원정보 업데이트 - NodeBird'})
}

exports.renderHashtag = async (req,res,next) => {
    console.log('hashtag : ',req.query.hashtag);
    const query = req.query.hashtag;

    if(!query){
        res.redirect('/');
    } else {
        const hashtag = await Hashtag.findOne({
            where:{
                title : query
            }
        })

        const posts = await hashtag?.getPosts() ?? [];

        res.render('main',{
            title:`${query}`,
            twits : posts
        });
    }
}