const { gql } = require('apollo-server')

module.exports = gql`
  type Post {
    id: ID!
    body: String!
    createdAt: String!
    username: String!
  }
  type User {
    id: ID!
    email: String!
    token: String!
    username: String!
    createdAt: String!
  }
  input RegisterInput {
    username: String!
    password: String!
    confirmPassword: String!
    email: String!
  }
  type Query {
    getPosts: [Post]
  }
  type Mutation {
    register(registerInput: RegisterInput): User!
  }
`

//search up inputs and what they do, instructor isn't clear
//we pass in a type to the register Mutation just so it isn't a huge block of code. it also required a return of a User
//queries are just getting data
//mutations make changes in our database
//required flags doesn't really mean it's required, just that those things have to be returned
