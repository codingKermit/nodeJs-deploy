import Sequelize, { CreationOptional, DataTypes, HasManyAddAssociationMixin, HasManyRemoveAssociationMixin, InferAttributes, InferCreationAttributes, NonAttribute } from 'sequelize';

import Post from './post'

class User extends Sequelize.Model<InferAttributes<User>,InferCreationAttributes<User>> {
    declare id : CreationOptional<number>;
    declare email : string;
    declare nickname : string;
    declare password? : string;
    declare provider? : string;
    declare snsId? : string;
    declare createdAt : CreationOptional<Date>;
    declare updatedAt : CreationOptional<Date>;
    declare deletedAt : CreationOptional<Date>;
    declare accessToken? : string;

    declare Followers : NonAttribute<User[]>
    declare Followings : NonAttribute<User[]>

    declare addTwit : HasManyAddAssociationMixin<Post, number>
    declare removeTwit : HasManyRemoveAssociationMixin<Post, number>;
    declare addFollowing : HasManyAddAssociationMixin<User,number>;
    declare removeFollowings : HasManyAddAssociationMixin<User,number>;

    static initiate(sequelize : Sequelize.Sequelize){
        User.init({
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                allowNull: false,
                primaryKey: true,
            },
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
            },
            createdAt: DataTypes.DATE,
            updatedAt: DataTypes.DATE,
            deletedAt: DataTypes.DATE,
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

    static associate(){
        User.hasMany(Post);
        User.belongsToMany(User,{ // 팔로워 -> 나를 팔로우 하는 사람
            foreignKey : 'followingId', // 팔로우 당하는 사람
            as : 'Followers', // 팔로우 하는 사람들
            through : 'Follow'
        });
        User.belongsToMany(User,{ // 팔로잉 -> 내가 팔로우 하는 사람
            foreignKey : 'followerId', // 팔로우 하는 사람
            as : 'Followings', // 팔로우 당하는 사람 
            through:'Follow'
        }); 
        User.belongsToMany(Post,{ // 게시글 좋아요
            through : 'TwitLike',
            as : 'Twit'
        })
    }
}

export default User;