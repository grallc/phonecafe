const express = require('express')
const productsRouter = express.Router()
const { getProducts, createProduct, updateProduct, deleteProduct, clearProducts } = require('../utils/dbUtils')

// GET /products -  Retrieve Products
productsRouter.get('/:id?', async (req, res) => {
  try {
    if (req.params.id && req.params.id.toLowerCase() === 'reset') {
      await clearProducts()
      return res.sendStatus(204)
    }
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
    const updated = await updateProduct(req.params, req.body)
    if (updated === 0) {
      return res.status(404).json({ error: 'Product not found' })
    }
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
    const deleted = await deleteProduct(req.params)
    if (deleted === 0) {
      return res.status(404).json({ error: 'Product not found' })
    }
    return res.sendStatus(204)
  } catch (error) {
    return res.status(500).json({
      error: error.message
    })
  }
})

module.exports = productsRouter
