const Ajv = require('ajv')
, ajv = Ajv({extendRefs: true})

ajv.addSchema(require('./schemas/xml-1.schema.json'))
ajv.addSchema(require('./schemas/xml.schema.json'))

console.log(
  ajv.validate('xml.schema.json', require('./ex1.xml.json')),
  ajv.errorsText(ajv.errors)
)