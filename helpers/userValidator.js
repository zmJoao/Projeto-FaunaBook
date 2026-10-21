// requerer as bibliotecas do validator
const { body, validationResult } = require('express-validator')

//Regras de Validações e Sanitização
const registerValidationRules = () => {
    return [
        body('name').trim().notEmpty().withMessage('O nome é Obrigatório'),
        body('email').trim().notEmpty().withMessage('O Email é obrigatório').isEmail().withMessage('Informe um email válido').normalizeEmail(),
        body('password').notEmpty().withMessage('A senha é Obrigatória'),
        body('phone').trim().notEmpty().withMessage('O telefone é Obrigatório'),
        body('tipo').trim().notEmpty().withMessage('O tipo é obrigatório').isIn(['admin', 'cliente']).withMessage('O tipo deve ser admin ou cliente')
    ]
}

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
    validate
}
