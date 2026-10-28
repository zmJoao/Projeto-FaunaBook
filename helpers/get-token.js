const getToken = (req) =>{
    const authHeader = req.headers.authorization || ''
    const [scheme, token] = authHeader.split(' ')
    return scheme?.toLowerCase() === 'bearer' ? token : null
}

module.exports = getToken