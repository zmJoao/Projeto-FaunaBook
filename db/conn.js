//requerer o siquelize
const Sequelize = require('sequelize')
require('dotenv').config()

//parametros de conexão
const conn = new Sequelize(
    process.env.DB_NAME || 'FaunaBook',
    process.env.DB_USER || 'root',
    process.env.DB_PASSWORD || '', {
        host: process.env.DB_HOST || 'localhost',
        dialect: 'mysql',
        port: Number(process.env.DB_PORT) || 3306,
        logging: false
    }
)

module.exports = conn