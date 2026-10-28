const { body, validationResult } = require('express-validator')

const validBase64 = value => /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(value)

const registerValidationRules = () => [
    body('title').trim().notEmpty().withMessage('O título é obrigatório').isLength({ max: 150 }).withMessage('O título deve ter até 150 caracteres'),
    body('description').trim().notEmpty().withMessage('A descrição é obrigatória'),
    body('image').optional({ values: 'falsy' }).isString().bail().custom(validBase64).withMessage('A imagem deve ser enviada em base64 válido')
]

const updateValidationRules = () => [
    body('title').optional().trim().notEmpty().withMessage('O título não pode ficar vazio').isLength({ max: 150 }).withMessage('O título deve ter até 150 caracteres'),
    body('description').optional().trim().notEmpty().withMessage('A descrição não pode ficar vazia'),
    body('image').optional().isString().bail().custom(validBase64).withMessage('A imagem deve ser enviada em base64 válido')
]

const validate = (req, res, next) => {
    const errors = validationResult(req)
    if (errors.isEmpty()) {
        return next()
    }
    return res.status(422).json({ message: errors.array()[0].msg })
}

module.exports = { registerValidationRules, updateValidationRules, validate }
