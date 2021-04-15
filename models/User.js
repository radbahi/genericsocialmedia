//mongodb is usually schemaless, but we can setup a schema to be more safe with mongoose
const { model, Schema } = require('mongoose')

//we can handle any sort of required or default data on the graphql layer, but you can define it here too if you want
const userSchema = new Schema({
  username: String,
  password: String,
  email: String,
  createdAt: String,
})

module.exports = model('User', userSchema)
