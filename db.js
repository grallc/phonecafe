const sqlite3 = require('sqlite3').verbose()
const database = new sqlite3.Database('./products.db', (error) => {
  if (error) {
    return console.error(`An error occured while connecting to the Database : "${error.message}".`)
  }
  console.log('Successfully connected to SQLite Database.')
})

database.run('CREATE TABLE IF NOT EXISTS products (id INTEGER PRIMARY KEY AUTOINCREMENT, brand TEXT, model TEXT, os TEXT, image TEXT, screensize TINYINT)', (error) => {
  if (error) {
    return console.error(`An error occured while created Products Table : "${error.message}".`)
  }
})

module.exports = database
