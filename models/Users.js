//requerer somente o metodo DataTypes do Sequelize
const {DataTypes} = require('sequelize')
//requerer a conexão com banco
const conn = require('../db/conn')

//definier o model user
const User = conn.define('users',{
    name:{
        type: DataTypes.STRING(100),
        allowNull: false
    },
    email:{
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: { isEmail: true }
    },
    password:{
        type: DataTypes.STRING,
        allowNull: false
    },
    image:{
        type: DataTypes.STRING,
    },
    phone:{
        type: DataTypes.STRING,
    },
    tipo:{
        type: DataTypes.ENUM('admin', 'cliente'),
        allowNull: false,
        defaultValue: 'cliente'
    }
}, {
    tableName: 'users'
})

module.exports = User
