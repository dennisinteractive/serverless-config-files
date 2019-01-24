'use strict'

const fs = require('fs-extra')
const jsYaml = require('js-yaml')

// Returns a promise to read YAML files
module.exports.read = (filePath) => {
  return fs.readFile(filePath, 'utf-8').then(fileBody => {
    let doc = jsYaml.safeLoad(fileBody, { schema: jsYaml.DEFAULT_SAFE_SCHEMA })
    return JSON.stringify(doc)
  })
}

// Returns a promise to write YAML files
module.exports.write = (filePath, doc) => {
  let fileBody = jsYaml.safeDump(doc)
  return fs.writeFile(filePath, fileBody)
}
