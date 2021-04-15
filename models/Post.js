//mongodb is usually schemaless, but we can setup a schema to be more safe with mongoose
const { model, Schema } = require('mongoose')

//we can handle any sort of required or default data on the graphql layer, but you can define it here too if you want
const postSchema = new Schema({
  body: String,
  username: String,
  createdAt: String,
  comments: [{ body: String, username: String, createdAt: String }],
  likes: [{ username: String, createdAt: String }],
  user: { type: Schema.Types.ObjectId, ref: 'users' },
})
//remember that mongoose is ORM, so we can have relations between models for user

module.exports = model('Post', postSchema)
