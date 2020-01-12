const express = require('express')
const app = express()
const port = process.env.PORT || 3000
const productsRouter = require('./api/products')
const bodyParser = require('body-parser')
const path = require('path')

app.use(express.static(path.join(__dirname, '/public')))

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use('/products', productsRouter)

// Redirect all unmatched paths to documentation
app.get('*', (req, res) => {
  res.sendFile('./doc/index.html', { root: __dirname })
})

app.listen(port)
console.log(`Server is now listening on port ${port}.`)
