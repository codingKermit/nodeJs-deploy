'use strict';

import fs from 'fs';
import path from 'path';
import Sequelize from 'sequelize';
import cls from 'cls-hooked';
import process from 'process';
const env = process.env.NODE_ENV as Env || 'development';
const basename = path.basename(__filename);
import configObject from '../config/config';
const config = configObject[env];

import User from './user';
import Post from './post';
import Hashtag from './hashtag';

const namespace = cls.createNamespace('transaction-namespace');
 
const sequelize = new Sequelize.Sequelize(
  config.database, config.username, config.password, config
)

User.initiate(sequelize);
Post.initiate(sequelize);
Hashtag.initiate(sequelize);

User.associate();
Post.associate();
Hashtag.associate();

Sequelize.Sequelize.useCLS(namespace);

export {User, Post, Hashtag, sequelize};