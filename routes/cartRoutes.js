const route = require('express').Router()

const cartController = require('../controllers/cartController')

//verificar token
const verifyToken = require('../helpers/verify-token')


route.post('/', verifyToken, cartController.createCart)
route.get('/', verifyToken, cartController.getCart)
route.post('/items', verifyToken, cartController.addItem)
route.patch('/items/:productId', verifyToken, cartController.updateItem)
route.delete('/items/:productId', verifyToken, cartController.removeItem)
route.delete('/items', verifyToken, cartController.clearCart)

module.exports = route