//requerer a biblioteca router do express
const route = require('express').Router()

const { validationResult } = require('express-validator')
//requerer o controller no UserController
const productController = require('../controllers/productController')
//requerer as validações
const {registerValidationRules, validate} = require('../helpers/productValidator')
//requerer a validação do token
const verifyToken = require('../helpers/verify-token.js')
//requerer a validação do admin
const verifyAdmin = require('../helpers/verify-admin.js')


//Register
route.post('/register',registerValidationRules(),verifyAdmin,validate,productController.register)
//Listar todos
route.get('/', verifyToken, productController.listAll)
//rota de update
route.post('/update/:id', verifyToken, verifyAdmin, productController.update)
//rota de delete
route.post('/delete/:id', verifyToken, productController.delete)

module.exports = route
