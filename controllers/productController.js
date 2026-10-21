//requerer a model do User
const Product = require('../models/Products')

module.exports = class ProductController{
    static async register(req, res){
        const {name, description, price, stock} = req.body

        //verificar se o produto já exite
        const productExists = await Product.findOne({where:{name:name}})
        if(productExists){
            res.status(422).json({
                message:"Produto já cadastrado, utilize outro nome"
            })
            return
        }

        //Criar o novo produto
        try {
            await Product.create({
                name: name,
                description: description,
                price: price,
                stock: stock
            })
            res.status(200).json({message:'Produto cadastrado com sucesso'})
        } catch (error) {
            res.status(500).json({message: error})
        }    
    }
    //metado para listar todos os produtos
    static async listAll(req, res){
        try {
            const products = await Product.findAll()
            res.status(200).json({products})    
        } catch (error) {
            res.status(500).json({error: error})
        }
        
    }

    //metado para listar todos os produtos
    static async listByID(req, res){
        const id = req.params
        
        try {
            const products = await Product.findAll({where: {id}})
            res.status(200).json({products})    
        } catch (error) {
            res.status(500).json({error: error})
        }
        
    }

    static async update(req, res){
        const {id} = req.params //id do produto na url
        const {name, description, price, stock} = req.body

        //atualizar usuario
        try{
            //procurar produto pelo id
            const productExists = await User.findByPk(id)
            if(!productExists){
                return res.status(404).json({message: "Produto não encontrado"})
            }

            await Product.update(
                {
                    name: name,
                    description: description,
                    price: price,
                    stock: stock
                },
                {
                    where: {id: id}
                }
            )
            res.status(200).json({message:'Produto alterado com sucesso'})
        }catch(error){
            res.status(500).json({message: error})
        }
    }

    static async delete(req, res){
        const {id} = req.params //id do produto na url
        try{
            await Product.destroy({
                where: {id: id}
            })
            res.status(200).json({message:'Produto deletado com sucesso'})
        }
        catch(error){
            res.status(500).json({message: error})
        }
    }

}