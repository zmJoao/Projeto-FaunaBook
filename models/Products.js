//requerer somente o metodo DataTypes do Sequelize
const {DataTypes} = require('sequelize')
//requerer a conexão com banco
const conn = require('../db/conn')

//definier o model user
const Product = conn.define('products',{
    name:{
        type: DataTypes.STRING,
        required: true
    },
    description:{
        type: DataTypes.STRING,
        required: true
    },
    price:{
        type: DataTypes.FLOAT,
        required: true
    },
    stock:{
        type: DataTypes.INTEGER,
    }
})

module.exports = Product
