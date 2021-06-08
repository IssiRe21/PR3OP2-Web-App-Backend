const {Sequelize, DataTypes} = require('sequelize');
const Model = Sequelize.Model;
const {sequelize} = require('./../config/db');

class Post extends Model {};

Post.init({
    username: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    content: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    com: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },

}, {
    sequelize,
    modelName: 'post',
});

module.exports = {Post};