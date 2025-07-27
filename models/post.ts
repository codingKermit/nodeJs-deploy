import Sequelize, {CreationOptional, DataTypes, ForeignKey, InferAttributes, InferCreationAttributes, HasManyAddAssociationsMixin} from "sequelize";

import User from './user';
import Hashtag from "./hashtag";

class Post extends Sequelize.Model<InferAttributes<Post>,InferCreationAttributes<Post>> {
    declare id : CreationOptional<number>;
    declare createdAt : CreationOptional<Date>;
    declare updatedAt : CreationOptional<Date>;
    declare content : string;
    declare img : string;
    declare imgUrl? : string;
    declare UserId : ForeignKey<User['id']>;

    declare addHashtags : HasManyAddAssociationsMixin<Hashtag,number>

    static initiate(sequelize : Sequelize.Sequelize){
        Post.init({
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                allowNull: false,
                primaryKey: true,
            },
            content : {
                type:Sequelize.STRING(140),
                allowNull : false,

            },
            img : {
                type : Sequelize.STRING(200),
                allowNull : true,
            },
            createdAt: DataTypes.DATE,
            updatedAt: DataTypes.DATE,
        },{
            sequelize,
            timestamps : true,
            underscored:false,
            paranoid:true,
            charset:'utf8mb4',
            collate:'utf8mb4_general_ci',
            tableName:'posts',
            modelName:'Post',
        })
    }

    static associate(){
        Post.belongsTo(User);
        Post.belongsToMany(Hashtag,{
            through:'PostHashtag'
        })
        Post.belongsToMany(User,{
            through:'TwitLike',
            as : 'Twitter'
        })
    }
}

export default Post;