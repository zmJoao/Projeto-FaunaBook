const bcrypt = require('bcrypt')
const { Op } = require('sequelize')
const User = require('../models/Users')
const Follow = require('../models/Follow')
const createUserToken = require('../helpers/create-user-token')

const publicUser = user => {
    const result = user.toJSON()
    delete result.password
    return result
}

module.exports = class UserController {
    static async register(req, res) {
        const { name, email, password, image, phone } = req.body

        try {
            const userExists = await User.findOne({ where: { email } })
            if (userExists) {
                return res.status(422).json({ message: 'Usuário já cadastrado, utilize outro e-mail' })
            }

            const passwordHash = await bcrypt.hash(password, 12)
            const user = await User.create({
                name,
                email,
                password: passwordHash,
                image: image || null,
                phone: phone || null,
                tipo: 'cliente'
            })
            return res.status(201).json({ message: 'Usuário cadastrado com sucesso', user: publicUser(user) })
        } catch (error) {
            if (error.name === 'SequelizeUniqueConstraintError') {
                return res.status(422).json({ message: 'Usuário já cadastrado, utilize outro e-mail' })
            }
            console.error(error)
            return res.status(500).json({ message: 'Erro ao cadastrar usuário' })
        }
    }

    static async listAll(req, res) {
        try {
            const users = await User.findAll({
                attributes: { exclude: ['password'] },
                order: [['name', 'ASC']]
            })
            return res.status(200).json({ users })
        } catch (error) {
            console.error(error)
            return res.status(500).json({ message: 'Erro ao consultar usuários' })
        }
    }

    static async getById(req, res) {
        try {
            const user = await User.findByPk(req.params.id, {
                attributes: { exclude: ['password'] }
            })
            if (!user) {
                return res.status(404).json({ message: 'Usuário não encontrado' })
            }
            return res.status(200).json({ user })
        } catch (error) {
            console.error(error)
            return res.status(500).json({ message: 'Erro ao consultar usuário' })
        }
    }

    static async login(req, res) {
        const { email, password } = req.body

        try {
            const user = await User.findOne({ where: { email } })
            if (!user || !(await bcrypt.compare(password, user.password))) {
                return res.status(401).json({ message: 'E-mail ou senha inválidos' })
            }
            return createUserToken(user, req, res)
        } catch (error) {
            console.error(error)
            return res.status(500).json({ message: 'Erro ao realizar login' })
        }
    }

    static async update(req, res) {
        const userId = Number(req.params.id)
        if (userId !== req.user.id && req.user.tipo !== 'admin') {
            return res.status(403).json({ message: 'Você não pode alterar este usuário' })
        }

        try {
            const user = await User.findByPk(userId)
            if (!user) {
                return res.status(404).json({ message: 'Usuário não encontrado' })
            }

            const { name, email, password, image, phone } = req.body
            const changes = {
                ...(name !== undefined && { name }),
                ...(email !== undefined && { email }),
                ...(image !== undefined && { image }),
                ...(phone !== undefined && { phone })
            }
            if (password) {
                changes.password = await bcrypt.hash(password, 12)
            }

            await user.update(changes)
            return res.status(200).json({ message: 'Usuário alterado com sucesso', user: publicUser(user) })
        } catch (error) {
            if (error.name === 'SequelizeUniqueConstraintError') {
                return res.status(409).json({ message: 'Este e-mail já está cadastrado' })
            }
            console.error(error)
            return res.status(500).json({ message: 'Erro ao alterar usuário' })
        }
    }

    static async delete(req, res) {
        const userId = Number(req.params.id)
        if (userId !== req.user.id && req.user.tipo !== 'admin') {
            return res.status(403).json({ message: 'Você não pode excluir este usuário' })
        }

        try {
            const user = await User.findByPk(userId)
            if (!user) {
                return res.status(404).json({ message: 'Usuário não encontrado' })
            }
            await user.destroy()
            return res.status(200).json({ message: 'Usuário deletado com sucesso' })
        } catch (error) {
            console.error(error)
            return res.status(500).json({ message: 'Erro ao excluir usuário' })
        }
    }

    static async follow(req, res) {
        const followedId = Number(req.params.id)
        if (!Number.isInteger(followedId) || followedId <= 0) {
            return res.status(400).json({ message: 'ID de usuário inválido' })
        }
        if (followedId === req.user.id) {
            return res.status(400).json({ message: 'Não é possível seguir a si mesmo' })
        }

        try {
            const target = await User.findByPk(followedId)
            if (!target) {
                return res.status(404).json({ message: 'Usuário não encontrado' })
            }
            const [follow, created] = await Follow.findOrCreate({
                where: { followerId: req.user.id, followedId }
            })
            return res.status(created ? 201 : 200).json({
                message: created ? 'Usuário seguido com sucesso' : 'Você já segue este usuário',
                follow
            })
        } catch (error) {
            console.error(error)
            return res.status(500).json({ message: 'Erro ao seguir usuário' })
        }
    }

    static async unfollow(req, res) {
        const followedId = Number(req.params.id)
        if (!Number.isInteger(followedId) || followedId <= 0) {
            return res.status(400).json({ message: 'ID de usuário inválido' })
        }

        try {
            const deleted = await Follow.destroy({
                where: { followerId: req.user.id, followedId }
            })
            if (!deleted) {
                return res.status(404).json({ message: 'Você não segue este usuário' })
            }
            return res.status(200).json({ message: 'Você deixou de seguir este usuário' })
        } catch (error) {
            console.error(error)
            return res.status(500).json({ message: 'Erro ao deixar de seguir usuário' })
        }
    }

    static async listFollowedUsers(req, res, relationship) {
        const userId = Number(req.params.id)
        if (!Number.isInteger(userId) || userId <= 0) {
            return res.status(400).json({ message: 'ID de usuário inválido' })
        }

        try {
            const target = await User.findByPk(userId)
            if (!target) {
                return res.status(404).json({ message: 'Usuário não encontrado' })
            }
            const relationshipField = relationship === 'followers' ? 'followerId' : 'followedId'
            const userIds = await Follow.findAll({
                attributes: [relationshipField],
                where: relationship === 'followers'
                    ? { followedId: userId }
                    : { followerId: userId }
            })
            const ids = userIds.map(row => row[relationshipField])
            const users = ids.length
                ? await User.findAll({
                    where: { id: { [Op.in]: ids } },
                    attributes: { exclude: ['password'] },
                    order: [['name', 'ASC']]
                })
                : []
            return res.status(200).json({ users })
        } catch (error) {
            console.error(error)
            return res.status(500).json({ message: 'Erro ao consultar seguidores' })
        }
    }
}
