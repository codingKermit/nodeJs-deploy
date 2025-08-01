import Sequelize, {CreationOptional, Model, DataTypes, InferAttributes, InferCreationAttributes, NonAttribute, BelongsToManyGetAssociationsMixin} from 'sequelize';
import Post from './post'

class Hashtag extends Model<InferAttributes<Hashtag>,InferCreationAttributes<Hashtag>> {
    declare id : CreationOptional<number>;
    declare title : string;
    declare createdAt : CreationOptional<Date>;
    declare updatedAt : CreationOptional<Date>;
    
    declare getPosts: BelongsToManyGetAssociationsMixin<Post>;

    static initiate(sequelize : Sequelize.Sequelize){
        Hashtag.init({
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                allowNull: false,
                primaryKey: true,
            },
            title : {
                type : Sequelize.STRING(15),
                allowNull:false,
                unique:true
            },
            createdAt: DataTypes.DATE,
            updatedAt: DataTypes.DATE,
        },{
            sequelize,
            timestamps: true,
            paranoid:true,
            charset:'utf8mb4',
            collate:'utf8mb4_general_ci',
            modelName:'Hashtag',
            tableName:'hashtags'
        })
    }

    static associate(){
    Hashtag.belongsToMany(Post,{
        through:'PostHashtag'
     })
    }
}

export default Hashtag;