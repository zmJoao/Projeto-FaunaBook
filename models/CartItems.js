//requerer somente o metodo DataTypes do Sequelize
const {DataTypes} = require('sequelize')
//requerer a conexão com banco
const conn = require('../db/conn')

// Definir o Model CartItems
const CartItem = conn.define('cartItems',{

    cartId:{
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'carts',
            key: 'id'
        }
    },
    productId:{
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'products',
            key: 'id'
        }
    },
    quantity:{
        type: DataTypes.INTEGER,
        allowNull: false
    }

}, {
    indexes: [
        {
            unique: true,
            fields: ['cartId', 'productId']
        }
    ]
})

module.exports = CartItem