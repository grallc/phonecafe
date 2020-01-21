const database = require('../db')
const { isValidField, isValidInput } = require('./utils')

module.exports.getProducts = (filters, productId) => {
  return new Promise((resolve, reject) => {
    let formattedFilters = 'WHERE '
    let filtersCount = 0
    if (productId) {
      database.all('SELECT * FROM products WHERE id = ?', [productId], (error, rows) => {
        if (error) {
          reject(error.message)
        }
        // If rows were found, return the first one.
        // Otherwise, return an empty object.
        resolve(rows.length > 0 ? rows[0] : { })
      })
    }
    // Convert all filters and fields into a string
    for (const key in filters) {
      // Check if whether or not the provided field is an existing one
      if (isValidField(key)) {
        formattedFilters += `${filtersCount !== 0 ? ' AND ' : ''}`
        formattedFilters += `${key} = ${key === 'screensize' ? filters[key] : `'${filters[key]}'`}`
        filtersCount++
      }
    }

    // Build the SQL request using the previously built string
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
    // Is the Input valid ?
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
    // Missing ID
    if (!params.id) {
      reject(new Error('Please provide a valid Product ID'))
    }
    let formattedUpdates = ''
    // Update provided fields.
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

module.exports.clearProducts = () => {
  return new Promise((resolve, reject) => {
    database.run('DELETE FROM products', function (error) {
      if (error) {
        reject(error.message)
      }
      resolve()
    })
  })
}
