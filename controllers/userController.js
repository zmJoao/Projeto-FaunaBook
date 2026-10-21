//requerer a model do User
const User = require('../models/Users')
//requer a bibliote bcrypt
const bcrypt = require('bcrypt')
//requerer o nosso serviço para gerar token
const createUserToken = require('../helpers/create-user-token')

module.exports = class UserController{
    static async register(req, res){
        const {name, email, password, image, phone, tipo} = req.body

        //verificar se o usuário já exite
        const userExists = await User.findOne({where:{email:email}})
        if(userExists){
            res.status(422).json({
                message:"Usuário já cadastrado, utilize outro e-mail"
            })
            return
        }


        //criptografar a senha
        const salt = await bcrypt.genSalt(12)
        const passwordHash = await bcrypt.hash(password, salt)

        //Criar o novo usario
        try {
            await User.create({
                name: name,
                email: email,
                password: passwordHash,
                phone: phone,
                tipo: tipo
            })
            res.status(200).json({message:'Usuario cadastrado com sucesso'})
        } catch (error) {
            res.status(500).json({message: error})
        }
    }
    //metado para listar todos os usuarios
    static async listAll(req, res){
        try {
            const users = await User.findAll()
            res.status(200).json({users})
        } catch (error) {
            res.status(500).json({error: error})
        }
        
    }

    //Criar o método de login
    static async login(req, res){
        //requerer pelo body os parametros do login
        const {email, password} = req.body

        //verificar se o usuario existe
        const user = await User.findOne({where:{email:email}})

        if(!user){
            res.status(422).json({
                message:"Não há usuário cadastrado com esse e-mail"
            })
            return
        }

        //verificar o password
        const checkPassword = await bcrypt.compare(password, user.password)

        //retornar a mensagem para senha incorreta
        if(!checkPassword){
            res.status(422).json({
                message:"Senha Invalida"
            })
            return
        }
        
        //geramos o token para o usuario
        await createUserToken(user, req, res)
    }

    static async update(req, res){
        const {id} = req.params //id do usuario na url
        const {name, email, password, image, phone} = req.body

        //atualizar usuario
        try{
            //procurar usuario pelo id
            const userExists = await User.findByPk(id)
            if(!userExists){
                return res.status(404).json({message: "usuário não encontrado"})
            }

            let passwordHash = userExists.password

            //só se a senha vier
            if(password){
                //criptografar senha
                const salt = await bcrypt.genSalt(12)
                passwordHash = await bcrypt.hash(password, salt)
            }

            await User.update(
                {
                    name: name,
                    email: email,
                    password: passwordHash,
                    phone: phone
                },
                {
                    where: {id: id}
                }
            )
            res.status(200).json({message:'Usuario alterado com sucesso'})
        }catch(error){
            res.status(500).json({message: error})
        }
    }

    static async delete(req, res){
        const {id} = req.params //id do usuario na url
        try{
            await User.destroy({
                where: {id: id}
            })
            res.status(200).json({message:'Usuario deletado com sucesso'})
        }
        catch(error){
            res.status(500).json({message: error})
        }
    }

}
