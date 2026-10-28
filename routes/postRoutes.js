const route = require('express').Router()
const postController = require('../controllers/postsController')
const { registerValidationRules, updateValidationRules, validate } = require('../helpers/postValidator')
const verifyToken = require('../helpers/verify-token')

route.get('/timeline', verifyToken, postController.timeline)
route.post('/', verifyToken, registerValidationRules(), validate, postController.register)
route.get('/', verifyToken, postController.listAll)
route.get('/:id', verifyToken, postController.getById)
route.patch('/:id', verifyToken, updateValidationRules(), validate, postController.update)
route.delete('/:id', verifyToken, postController.delete)

module.exports = route
