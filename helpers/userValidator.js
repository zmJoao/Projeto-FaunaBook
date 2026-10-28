// requerer as bibliotecas do validator
const { body, validationResult } = require('express-validator')

//Regras de Validações e Sanitização
const registerValidationRules = () => {
    return [
        body('name').trim().notEmpty().withMessage('O nome é Obrigatório').isLength({ max: 100 }).withMessage('O nome deve ter até 100 caracteres'),
        body('email').trim().notEmpty().withMessage('O Email é obrigatório').isEmail().withMessage('Informe um email válido').normalizeEmail(),
        body('password').isString().isLength({ min: 8 }).withMessage('A senha deve ter pelo menos 8 caracteres'),
        body('phone').optional({ values: 'falsy' }).trim().isLength({ max: 30 }).withMessage('O telefone deve ter até 30 caracteres'),
        body('image').optional({ values: 'falsy' }).isString().withMessage('A imagem deve ser uma URL ou texto'),
    ]
}

const updateValidationRules = () => [
    body('name').optional().trim().notEmpty().withMessage('O nome não pode ficar vazio').isLength({ max: 100 }).withMessage('O nome deve ter até 100 caracteres'),
    body('email').optional().trim().isEmail().withMessage('Informe um e-mail válido').normalizeEmail(),
    body('password').optional().isString().isLength({ min: 8 }).withMessage('A senha deve ter pelo menos 8 caracteres'),
    body('phone').optional().isString().trim().isLength({ max: 30 }).withMessage('O telefone deve ter até 30 caracteres'),
    body('image').optional().isString().withMessage('A imagem deve ser uma URL ou texto'),
    (req, res, next) => {
        if (Object.keys(req.body || {}).length === 0) {
            return res.status(422).json({ message: 'Informe ao menos um campo para atualizar' })
        }
        return next()
    }
]

//Validação
const validate = (req, res, next) => {
    const errors = validationResult(req)
    if(errors.isEmpty()){
        return next()
    }
    //Retornar o primeiro erro encontrado
    return res.status(422).json({message: errors.array()[0].msg})
}

module.exports = {
    registerValidationRules,
    updateValidationRules,
    validate
}
