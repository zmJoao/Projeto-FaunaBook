//requere o express
const express = require('express')
//instancia do express
const api = express()
//requerer o cors
const cors = require('cors')
//requerer a conexao
const conn = require('./db/conn')
//requerer os Models
const User = require('./models/Users')
const Product = require('./models/Products')
//requerer a rotas
const userRoutes = require('./routes/userRotues')
const productRoutes = require('./routes/productRoutes')
const cartRoutes = require('./routes/cartRoutes')

//Configurando JSON response
api.use(express.json())

//salve cors
api.use(cors({ credentials: true, origin: 'http://localhost:3030' }))

api.use('/users',userRoutes)
api.use('/products',productRoutes)
api.use('/cart',cartRoutes)

//start api
conn.sync()
    .then(() => { api.listen(3030) })
    .catch(error => { console.info(error) })
