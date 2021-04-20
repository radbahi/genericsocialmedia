//this index.js file is used to combine all the resolvers
const posts = require('./posts')
const postsResolvers = require('./posts')
const usersResolvers = require('./users')

module.exports = {
  Query: {
    ...postsResolvers.Query, // spread operator? why?
  },
  Mutation: {
    ...usersResolvers.Mutation,
    ...postsResolvers.Mutation,
  },
}
