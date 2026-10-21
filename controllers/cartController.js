// Requerer o modelo cart
const Cart = require('../models/Carts')
const CartItem = require('../models/CartItems')
const Product = require('../models/Products')
const {Op} = require('sequelize')

const isPositiveInteger = value => Number.isInteger(value) && value > 0

module.exports = class CartController{

    // post que cria o carrinho atrelado a um id de usuário
    static async createCart(req, res){
        const userId = req.user && req.user.id
        if(!userId){
            return res.status(401).json({message: 'Usuário não autenticado'})
        }

        try {
            const cartExists = await Cart.findOne({where: {userId}})
            if(cartExists){
                return res.status(409).json({message: 'Carrinho já existe para este usuário'})
            }

            const cart = await Cart.create({userId})
            return res.status(201).json({message: 'Carrinho criado com sucesso', cart})
        } catch (error) {
            if(error.name === 'SequelizeUniqueConstraintError'){
                return res.status(409).json({message: 'Carrinho já existe para este usuário'})
            }

            return res.status(500).json({message: 'Erro ao criar carrinho'})
        }
    }

    // req get que mostra se o usuário tem um carrinho criado
    static async getCart(req, res){
        const userId = req.user && req.user.id

        try {
            const cart = await Cart.findOne({where: {userId}})
            if(!cart){
                return res.status(404).json({message: 'Carrinho não encontrado'})
            }

            const cartItems = await CartItem.findAll({where: {cartId: cart.id}})
            const productIds = cartItems.map(item => item.productId)
            const products = productIds.length
                ? await Product.findAll({where: {id: {[Op.in]: productIds}}})
                : []
            const productsById = new Map(products.map(product => [product.id, product]))
            let total = 0

            const items = cartItems.map(item => {
                const product = productsById.get(item.productId)
                const subtotal = product ? Number(product.price) * item.quantity : 0
                total += subtotal

                return {
                    ...item.toJSON(),
                    product: product ? product.toJSON() : null,
                    subtotal
                }
            })

            return res.status(200).json({cartId: cart.id, items, total})
        } catch (error) {
            return res.status(500).json({message: 'Erro ao consultar carrinho'})
        }
    }

    // post que add os itens no carrinho
    static async addItem(req, res){
        const userId = req.user && req.user.id
        const {productId, quantity} = req.body

        if(!isPositiveInteger(productId) || !isPositiveInteger(quantity)){
            return res.status(400).json({message: 'productId e quantity devem ser números inteiros maiores que zero'})
        }

        try {
            const cart = await Cart.findOne({where: {userId}})
            if(!cart){
                return res.status(404).json({message: 'Carrinho não encontrado; crie o carrinho antes de adicionar itens'})
            }

            const product = await Product.findByPk(productId)
            if(!product){
                return res.status(404).json({message: 'Produto não encontrado'})
            }

            const cartItem = await CartItem.findOne({where: {cartId: cart.id, productId}})
            const newQuantity = (cartItem ? cartItem.quantity : 0) + quantity
            if(product.stock !== null && product.stock !== undefined && newQuantity > product.stock){
                return res.status(422).json({message: 'Quantidade solicitada maior que o estoque disponível'})
            }

            const savedItem = cartItem
                ? await cartItem.update({quantity: newQuantity})
                : await CartItem.create({cartId: cart.id, productId, quantity: newQuantity})

            return res.status(cartItem ? 200 : 201).json({
                message: cartItem ? 'Quantidade do item atualizada' : 'Item adicionado ao carrinho',
                item: {...savedItem.toJSON(), product: product.toJSON()}
            })
        } catch (error) {
            if(error.name === 'SequelizeUniqueConstraintError'){
                return res.status(409).json({message: 'O item foi alterado por outra requisição; consulte o carrinho e tente novamente'})
            }

            return res.status(500).json({message: 'Erro ao adicionar item ao carrinho'})
        }
    }


    static async updateItem(req, res){
        const userId = req.user && req.user.id
        const productId = Number(req.params.productId)
        const {quantity} = req.body

        if(!isPositiveInteger(productId) || !isPositiveInteger(quantity)){
            return res.status(400).json({message: 'productId e quantity devem ser números inteiros maiores que zero'})
        }

        try {
            const cart = await Cart.findOne({where: {userId}})
            if(!cart){
                return res.status(404).json({message: 'Carrinho não encontrado'})
            }

            const cartItem = await CartItem.findOne({where: {cartId: cart.id, productId}})
            if(!cartItem){
                return res.status(404).json({message: 'Item não encontrado no carrinho'})
            }

            const product = await Product.findByPk(productId)
            if(!product){
                return res.status(404).json({message: 'Produto não encontrado'})
            }
            if(product.stock !== null && product.stock !== undefined && quantity > product.stock){
                return res.status(422).json({message: 'Quantidade solicitada maior que o estoque disponível'})
            }

            await cartItem.update({quantity})
            return res.status(200).json({
                message: 'Quantidade do item atualizada',
                item: {...cartItem.toJSON(), product: product.toJSON()}
            })
        } catch (error) {
            return res.status(500).json({message: 'Erro ao atualizar item do carrinho'})
        }
    }

    static async removeItem(req, res){
        const userId = req.user && req.user.id
        const productId = Number(req.params.productId)

        if(!isPositiveInteger(productId)){
            return res.status(400).json({message: 'productId deve ser um número inteiro maior que zero'})
        }

        try {
            const cart = await Cart.findOne({where: {userId}})
            if(!cart){
                return res.status(404).json({message: 'Carrinho não encontrado'})
            }

            const deletedCount = await CartItem.destroy({where: {cartId: cart.id, productId}})
            if(!deletedCount){
                return res.status(404).json({message: 'Item não encontrado no carrinho'})
            }

            return res.status(200).json({message: 'Item removido do carrinho'})
        } catch (error) {
            return res.status(500).json({message: 'Erro ao remover item do carrinho'})
        }
    }

    static async clearCart(req, res){
        const userId = req.user && req.user.id

        try {
            const cart = await Cart.findOne({where: {userId}})
            if(!cart){
                return res.status(404).json({message: 'Carrinho não encontrado'})
            }

            await CartItem.destroy({where: {cartId: cart.id}})
            return res.status(200).json({message: 'Itens removidos do carrinho'})
        } catch (error) {
            return res.status(500).json({message: 'Erro ao esvaziar carrinho'})
        }
    }
}