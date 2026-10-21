//requerer a biblioteca router do express
const route = require('express').Router()

const { validationResult } = require('express-validator')
//requerer o controller no UserController
const userController = require('../controllers/userController')
//requerer as validações
const {registerValidationRules, validate} = require('../helpers/userValidator')
//requerer a validação do token
const verifyToken = require('../helpers/verify-token.js')


//Register
route.post('/register',registerValidationRules(),validate,userController.register)
//Listar todos
route.get('/', verifyToken, userController.listAll)
//rota de login
route.post('/login', userController.login)
//rota de update
route.post('/update/:id', verifyToken, userController.update)
//rota de delete
route.post('/delete/:id', verifyToken, userController.delete)

module.exports = route