require('dotenv').config()
//requerer a bibioteca jwt
const jwt = require('jsonwebtoken')

//criar o metodo para gerar o token
const createUserToken = async(user, req, res)=>{
    const token = jwt.sign({
        name: user.name,
        id: user.id,
        tipo: user.tipo
    }, process.env.CHAVETOKEN)

    //retornamos o token
    res.status(200).json({token:token})
}
module.exports = createUserToken
