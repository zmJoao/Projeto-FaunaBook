// requerer as bibliotecas do validator
const { body, validationResult } = require('express-validator')

//Regras de Validações
const registerValidationRules = () => {
    return [
        body('name').notEmpty().withMessage('O nome é obrigatório'),
        body('description').notEmpty().withMessage('A descrição é obrigatória'),
        body('price').notEmpty().withMessage('O preço é obrigatório'),
        body('stock').notEmpty().withMessage('A quantidade em estoque é obrigatória'),
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