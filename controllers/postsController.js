const { Op } = require('sequelize')
const Post = require('../models/Posts')
const User = require('../models/Users')
const Follow = require('../models/Follow')

const serializePost = post => {
    const result = post.toJSON()
    if (result.image) {
        result.image = Buffer.from(result.image).toString('base64')
    }
    return result
}

module.exports = class PostsController {
    static async register(req, res) {
        const { title, description, image } = req.body

        try {
            const post = await Post.create({
                title,
                description,
                image: image ? Buffer.from(image, 'base64') : null,
                userId: req.user.id
            })

            return res.status(201).json({ message: 'Post criado com sucesso', post: serializePost(post) })
        } catch (error) {
            console.error(error)
            return res.status(500).json({ message: 'Erro ao criar post' })
        }
    }

    static async listAll(req, res) {
        try {
            const posts = await Post.findAll({
                include: [{ model: User, as: 'author', attributes: ['id', 'name', 'image'] }],
                order: [['createdAt', 'DESC']]
            })
            return res.status(200).json({ posts: posts.map(serializePost) })
        } catch (error) {
            console.error(error)
            return res.status(500).json({ message: 'Erro ao consultar posts' })
        }
    }

    static async timeline(req, res) {
        try {
            const follows = await Follow.findAll({
                attributes: ['followedId'],
                where: { followerId: req.user.id }
            })
            const followedIds = follows.map(follow => follow.followedId)

            const posts = await Post.findAll({
                where: { userId: { [Op.in]: [...followedIds, req.user.id] } },
                include: [{ model: User, as: 'author', attributes: ['id', 'name', 'image'] }],
                order: [['createdAt', 'DESC']]
            })
            return res.status(200).json({ posts: posts.map(serializePost) })
        } catch (error) {
            console.error(error)
            return res.status(500).json({ message: 'Erro ao carregar a timeline' })
        }
    }

    static async getById(req, res) {
        try {
            const post = await Post.findByPk(req.params.id, {
                include: [{ model: User, as: 'author', attributes: ['id', 'name', 'image'] }]
            })
            if (!post) {
                return res.status(404).json({ message: 'Post não encontrado' })
            }
            return res.status(200).json({ post: serializePost(post) })
        } catch (error) {
            console.error(error)
            return res.status(500).json({ message: 'Erro ao consultar post' })
        }
    }

    static async update(req, res) {
        try {
            const post = await Post.findByPk(req.params.id)
            if (!post) {
                return res.status(404).json({ message: 'Post não encontrado' })
            }
            if (post.userId !== req.user.id && req.user.tipo !== 'admin') {
                return res.status(403).json({ message: 'Você não pode alterar este post' })
            }

            const { title, description, image } = req.body
            await post.update({
                ...(title !== undefined && { title }),
                ...(description !== undefined && { description }),
                ...(image !== undefined && { image: image ? Buffer.from(image, 'base64') : null })
            })
            return res.status(200).json({ message: 'Post alterado com sucesso', post: serializePost(post) })
        } catch (error) {
            console.error(error)
            return res.status(500).json({ message: 'Erro ao alterar post' })
        }
    }

    static async delete(req, res) {
        try {
            const post = await Post.findByPk(req.params.id)
            if (!post) {
                return res.status(404).json({ message: 'Post não encontrado' })
            }
            if (post.userId !== req.user.id && req.user.tipo !== 'admin') {
                return res.status(403).json({ message: 'Você não pode excluir este post' })
            }

            await post.destroy()
            return res.status(200).json({ message: 'Post deletado com sucesso' })
        } catch (error) {
            console.error(error)
            return res.status(500).json({ message: 'Erro ao excluir post' })
        }
    }
}
