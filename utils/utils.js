module.exports.getFields = () => {
  return ['brand', 'model', 'os', 'image', 'screensize']
}

module.exports.isValidField = (field) => {
  return this.getFields().indexOf(field.toLowerCase()) > -1
}

module.exports.isValidInput = (input) => {
  const info = {
    isValid: true,
    error: ''
  }
  const fields = this.getFields()

  for (const field of fields) {
    if (!input[field]) {
      info.isValid = false
      info.error = `Missing '${field}' field.`
      break
    }
  }
  return info
}