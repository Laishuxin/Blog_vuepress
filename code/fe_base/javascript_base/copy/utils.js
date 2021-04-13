var isObject = obj => {
  var type = typeof obj
  return obj !== null && (type === 'object' || type === 'function')
}

var isArray = Array.isArray

module.exports = {
  isObject,
  isArray
}

