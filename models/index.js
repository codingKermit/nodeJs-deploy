'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const cls = require('cls-hooked');
const process = require('process');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};
const namespace = cls.createNamespace('transaction-namespace');

const sequelize = new Sequelize(
  config.database, config.username, config.password, config
)

Sequelize.useCLS(namespace);

fs.readdirSync(__dirname)
.filter( file => {
  return file !== basename && !file.includes('test') && file.indexOf('.') !== 0 && file.slice(-3) === '.js';
})
.forEach(file => {
  const model = require(path.join(__dirname,file));
  db[model.name] = model;
  model.initiate(sequelize);
  /* model.associate(db); 
  여기서 바로 관계를 생성할 수 없음
  모델 생성 -> 관계 생성 순서대로 이루어져야함
  생성되지 않은 모델에 대해 관계를 만들 수는 없기 때문
  */
})

Object.keys(db).forEach(modelName => {
  if(db[modelName].associate){
    db[modelName].associate(db);
  }
})

// Object.keys(db).forEach(name => {
//   console.log(db[name].associations);
// })

db.sequelize = sequelize;
db.namespace = namespace;

module.exports = db;
