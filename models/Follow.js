const { DataTypes } = require('sequelize')
const conn = require('../db/conn')

const Follow = conn.define('follows', {
    followerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
    },
    followedId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
    }
}, {
    tableName: 'follows',
    timestamps: true
})

module.exports = Follow
