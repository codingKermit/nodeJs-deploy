const Sequelize = require('sequelize');

class User extends Sequelize.Model {
    static initiate(sequelize){
        User.init({
            email:{
                type:Sequelize.STRING(40),
                allowNull:true,
                unique:true
            },
            nickname:{
                type:Sequelize.STRING(15),
                allowNull:false,
            },
            password:{
                type:Sequelize.STRING(100),
                allowNull:true,
            },
            provider:{
                type:Sequelize.ENUM('local','kakao'),
                allowNull:false,
                defaultValue:'local'
            },
            snsId:{
                type:Sequelize.STRING(30),
                allowNull:true,
            }
        },{
            sequelize,
            timestamps : true, // createdAt, updatedAt 필드 자동 생성
            underscored : false, // true로 하면 created_at, updated_at 등의 시퀄라이즈에서 생성하는 필드를 스네이크 케이스로 사용
            modelName : 'User',
            tableName : 'users',
            paranoid : true, // deletedAt 필드 자동 생성
            charset : 'utf8mb4',
            collate : 'utf8mb4_general_ci'
        })
    }

    static associate(db){
        db.User.hasMany(db.Post);
        db.User.belongsToMany(db.User,{ // 팔로워 -> 나를 팔로우 하는 사람
            foreignKey : 'followingId', // 팔로우 당하는 사람
            as : 'Followers', // 팔로우 하는 사람들
            through : 'Follow'
        });
        db.User.belongsToMany(db.User,{ // 팔로잉 -> 내가 팔로우 하는 사람
            foreignKey : 'followerId', // 팔로우 하는 사람
            as : 'Followings', // 팔로우 당하는 사람 
            through:'Follow'
        }); 
        db.User.belongsToMany(db.Post,{ // 게시글 좋아요
            through : 'TwitLike',
            as : 'Twit'
        })
    }
}

module.exports = User;