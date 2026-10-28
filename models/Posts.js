//requerer somente o metodo DataTypes do Sequelize
const {DataTypes} = require('sequelize')
//requerer a conexão com banco
const conn = require('../db/conn')

//definier o modelo Posts
const Post = conn.define('posts',{
    title:{
        type: DataTypes.STRING(150),
        allowNull: false
    },
    description:{
        type: DataTypes.TEXT,
        allowNull: false
    },
    image:{
        type: DataTypes.BLOB('long'),
        allowNull: true
    }
}, {
    tableName: 'posts'
})

module.exports = Post
