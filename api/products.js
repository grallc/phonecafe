const express = require('express')
const productsRouter = express.Router()
const { getProducts, createProduct, updateProduct, deleteProduct } = require('../utils/dbUtils')

// GET /products -  Retrieve Products
productsRouter.get('/:id?', async (req, res) => {
  try {
    const products = await getProducts(req.query, req.params.id)
    return res.json(products)
  } catch (error) {
    return res.status(500).json({
      error: error.message
    })
  }
})

// Create Products
productsRouter.post('/', async (req, res) => {
  try {
    await createProduct(req.body)
    return res.sendStatus(201)
  } catch (error) {
    return res.status(500).json({
      error: error.message
    })
  }
})

// Update Products
productsRouter.put('/:id?', async (req, res) => {
  try {
    await updateProduct(req.params, req.body)
    return res.sendStatus(204)
  } catch (error) {
    return res.status(500).json({
      error
    })
  }
})

// Delete Products
productsRouter.delete('/:id?', async (req, res) => {
  try {
    await deleteProduct(req.params)
    return res.sendStatus(204)
  } catch (error) {
    return res.status(500).json({
      error: error.message
    })
  }
})

module.exports = productsRouter
