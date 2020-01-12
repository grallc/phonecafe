const database = require('../db')
const { isValidField, isValidInput } = require('./utils')

module.exports.getProducts = (filters, productId) => {
  return new Promise((resolve, reject) => {
    let formattedFilters = 'WHERE '
    let filtersCount = 0
    if (productId) {
      filtersCount++
      formattedFilters += `id = ${productId}`
    } else {
      for (const key in filters) {
        if (isValidField(key)) {
          formattedFilters += `${filtersCount !== 0 ? ' AND ' : ''}`
          formattedFilters += `${key} = ${key === 'screensize' ? filters[key] : `'${filters[key]}'`}`
          filtersCount++
        }
      }
    }
    database.all(`SELECT * FROM products ${filtersCount > 0 ? formattedFilters : ''}`, (error, rows) => {
      if (error) {
        reject(error.message)
      }
      resolve(rows)
    })
  })
}

module.exports.createProduct = (body = {}) => {
  return new Promise((resolve, reject) => {
    const checkedInput = isValidInput(body)
    if (!checkedInput.isValid) {
      reject(checkedInput.error)
    }
    database.run('INSERT INTO products(brand, model, os, image, screensize) VALUES(?, ?, ?, ?, ?)', [body.brand, body.model, body.os, body.image, body.screensize], function (error) {
      if (error) {
        reject(error.message)
      }
      resolve(this.lastID)
    })
  })
}

module.exports.updateProduct = (params = {}, body = {}) => {
  return new Promise((resolve, reject) => {
    if (!params.id) {
      reject(new Error('Please provide a valid Product ID'))
    }
    let formattedUpdates = ''
    for (const key in body) {
      if (isValidField(key)) {
        formattedUpdates += `${key} = ${key === 'screensize' ? body[key] : `'${body[key]}'`}, `
      }
    }

    // No required update. Doing a SQL request is useless.
    if (formattedUpdates.length === 0) {
      resolve(0)
    }

    // Remove the useless `,` and ` ` at the end of formattedUpdates
    formattedUpdates = formattedUpdates.substring(0, formattedUpdates.length - 2)

    database.run(`UPDATE products SET ${formattedUpdates} WHERE id = ?`, [params.id], function (error) {
      if (error) {
        reject(error.message)
      }
      resolve(this.changes)
    })
  })
}

module.exports.deleteProduct = (params) => {
  return new Promise((resolve, reject) => {
    if (!params.id) {
      reject(new Error('Please provide a valid Product ID'))
    }
    database.run('DELETE FROM products WHERE id = ?', [params.id], function (error) {
      if (error) {
        reject(error.message)
      }
      resolve(this.changes)
    })
  })
}
