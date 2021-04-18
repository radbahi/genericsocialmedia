const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { UserInputError } = require('apollo-server') // apollo has error handling too

const { validateRegisterInput } = require('../../util/validators')
const { SECRET_KEY } = require('../../config')
const User = require('../../models/User')

// we make register async and await password because bcrypt hashing is asynchronous
module.exports = {
  Mutation: {
    async register(
      _,
      { registerInput: { username, email, password, confirmPassword } }
    ) {
      //Validates user data
      const { valid, errors } = validateRegisterInput(
        username,
        email,
        password,
        confirmPassword
      )
      if (!valid) {
        throw new UserInputError('Errors', { errors })
      }

      // find a username and throw an error if one already exists
      const user = await User.findOne({ username })
      if (user) {
        throw new UserInputError('Username is taken', {
          errors: {
            username: 'This username is taken',
          },
        })
      } // the errors object passed in is to be used in the frontend

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

// search up what parent, _, and args do when passed into a mutation
// the args, which is the second parameter in register, come from RegisterInput in typeDefs
// we are currently destructuring the args from RegisterInput
// info is just general info about metadata, don't really need
