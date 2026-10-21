require('dotenv').config()
//requerer a biblioteca jwt
const jwt = require('jsonwebtoken')
//requerer o metodo parar recuperar o token
const getToken = require('./get-token.js')

//criar metodo para verificar o token
const checkToken = (req, res, next)=>{
    //1-caso o cabeçalho esteja vazio
    if(!req.headers.authorization){
        return res.status(401).json({message: 'Acesso negado'})
    }

    //recuperar o token
    const token = getToken(req)

    //2-caso o token seja inexistente
    if(!token){
        return res.status(401).json({message: 'Acesso negado'})
    }

    //3-verificar validade do token
    try{
        const verified = jwt.verify(token, process.env.CHAVETOKEN)
        req.user = verified
        next()
    }
    catch(error){
        return res.status(401).json({message: 'Acesso negado'})
    }
}

module.exports = checkToken
