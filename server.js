const express = require('express')
const api = express()
const cors = require('cors')
const conn = require('./db/conn')
require('./models/associations')
const userRoutes = require('./routes/userRotues')
const postRoutes = require('./routes/postRoutes')

api.use(express.json({ limit: '10mb' }))
api.use(cors({ credentials: true, origin: process.env.CLIENT_ORIGIN || 'http://localhost:3030' }))

api.use('/users', userRoutes)
api.use('/posts', postRoutes)

const port = process.env.PORT || 3030

conn.authenticate()
    .then(() => conn.sync({ alter: true }))
    .then(() => {
        api.listen(port, () => console.info(`FaunaBook API listening on port ${port}`))
    })
    .catch(error => {
        console.error('Não foi possível iniciar a API:', error)
        process.exitCode = 1
    })
