const Sequelize = require('sequelize');

class Hashtag extends Sequelize.Model {
    static initiate(sequelize){
        Hashtag.init({
            title : {
                type : Sequelize.STRING(15),
                allowNull:false,
                unique:true
            }
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

    static associate(db){
    db.Hashtag.belongsToMany(db.Post,{
        through:'PostHashtag'
     })
    }
}

module.exports = Hashtag;