const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const User = require('../../models/User')
const { SECRET_KEY } = require('../../config')

// we make register async and await password because bcrypt hashing is asynchronous
module.exports = {
  Mutation: {
    async register(
      _,
      { registerInput: { username, email, password, confirmPassword } },
      context,
      info
    ) {
      // TODO: Validate user data
      // TODO: Make sure user doesn't already exist
      password = await bcrypt.hash(password, 12) //hash the password for 12 rounds
      const newUser = new User({
        email,
        username,
        password,
        createdAt: new Date().toISOString(),
      })
      const res = await newUser.save()

      //hash the token with the user's info
      const token = jwt.sign(
        {
          id: res.id,
          email: res.email,
          username: res.username,
        },
        SECRET_KEY,
        { expiresIn: '1h' }
      )

      return {
        ...res._doc, // instructor says _doc is for where our document is stored?? referring to mongodb and how it works?
        id: res._id,
        token,
      }
    },
  },
}

// search up what parent, _, args, context, and info does when passed into a mutation
// the args, which is the second parameter in register, come from RegisterInput in typeDefs
// we are currently destructuring the args from RegisterInput
// info is just general info about metadata, don't really need
