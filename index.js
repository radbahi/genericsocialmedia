const { ApolloServer } = require('apollo-server') // apollo-server is a graphql server
const gql = require('graphql-tag') // a dependency of apollo-server that comes installed with it
const mongoose = require('mongoose') //mongoose is an ORM which lets us interface with our mongodb database

const Post = require('./models/Post')
const User = require('./models/User')
const { MONGODB } = require('./config') //config is not gonna be pushed to github, like an env file

//inside of the types we will have all our queries and say what type they return. kind of like typescript
//the exclamation mark means that type is required
const typeDefs = gql`
  type Query {
    getPosts
  }
`

//resolvers are attached to queries, mutations, and subscriptions. resolvers process some sort of logic and returns what the query returns
const resolvers = {
  Query: {
    sayHi: () => 'Hello World!',
  },
}

//this is how to actually make the server. remember to pass in the type definitions and resolvers.
const server = new ApolloServer({ typeDefs, resolvers })
mongoose
  .connect(MONGODB, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('MongoDB connected')
    return server.listen({ port: 5000 })
  })
  .then((res) => {
    console.log(`Server running at ${res.url}`)
  })

//apollo also uses express in the background
