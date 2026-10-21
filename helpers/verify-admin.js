
// verifica se o usuário é admin
const verifyAdmin = (req, res, next) => {
    if (req.user?.tipo !== 'admin') {
        return res.status(403).json({ message: 'Acesso permitido somente para administradores' })
    }

    next()
}

module.exports = verifyAdmin