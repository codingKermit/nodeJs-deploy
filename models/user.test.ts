import Sequelize from 'sequelize';
import User from './user';
import configObj from '../config/config';
const config = configObj['test'];
const sequelize = new Sequelize.Sequelize(
    config.database, config.username, config.password, config
);

describe('User 모델', () => {
    test('user initiate 테스트',()=>{
        expect(User.initiate(sequelize)).toBe(undefined);
    });

    test('user associate 테스트',()=>{
        const db = {
            User : {
                hasMany : jest.fn(),
                belongsToMany : jest.fn() 
            },
            Post: {}
        };
        User.associate();
        expect(db.User.hasMany).toHaveBeenCalledWith(db.Post);
        expect(db.User.belongsToMany).toHaveBeenCalledTimes(3);
    })
});