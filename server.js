const express = require('express')
const app = express()
const port = process.env.PORT || 3000
const productsRouter = require('./api/products')
const bodyParser = require('body-parser')
const cors = require('cors')

app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use('/products', productsRouter)
app.use(express.static('public'))


app.use('*', express.static('public'))

app.listen(port)
console.log(`Server is now listening on port ${port}.`)
