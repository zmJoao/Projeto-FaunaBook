const route = require('express').Router()
const { body } = require('express-validator')
const userController = require('../controllers/userController')
const { registerValidationRules, updateValidationRules, validate } = require('../helpers/userValidator')
const verifyToken = require('../helpers/verify-token')
const verifyAdmin = require('../helpers/verify-admin')

route.post('/register', registerValidationRules(), validate, userController.register)
route.post('/login', [
    body('email').isEmail().withMessage('Informe um e-mail válido'),
    body('password').isString().notEmpty().withMessage('A senha é obrigatória'),
    validate
], userController.login)
route.get('/', verifyToken, verifyAdmin, userController.listAll)
route.get('/:id/followers', verifyToken, (req, res) => userController.listFollowedUsers(req, res, 'followers'))
route.get('/:id/following', verifyToken, (req, res) => userController.listFollowedUsers(req, res, 'following'))
route.post('/:id/follow', verifyToken, userController.follow)
route.delete('/:id/follow', verifyToken, userController.unfollow)
route.get('/:id', verifyToken, userController.getById)
route.patch('/:id', verifyToken, updateValidationRules(), validate, userController.update)
route.delete('/:id', verifyToken, userController.delete)

module.exports = route
