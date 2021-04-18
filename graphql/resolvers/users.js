const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { UserInputError } = require('apollo-server') // apollo has error handling too

const {
  validateRegisterInput,
  validateLoginInput,
} = require('../../util/validators')
const { SECRET_KEY } = require('../../config')
const User = require('../../models/User')

//token helper function
function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      username: user.username,
    },
    SECRET_KEY,
    { expiresIn: '1h' }
  )
}

module.exports = {
  Mutation: {
    async login(_, { username, password }) {
      const { errors, valid } = validateLoginInput(username, password)

      if (!valid) {
        throw new UserInputError('Errors', { errors })
      }

      const user = await User.findOne({ username })
      if (!user) {
        errors.general = 'User not found' //we're defining a new subset of errors called general here
        throw new UserInputError('User not found', { errors })
      }

      const match = await bcrypt.compare(password, user.password)

      if (!match) {
        errors.general = 'Wrong credentials' //we're defining a new subset of errors called general here
        throw new UserInputError('Wrong credentials', { errors })
      }

      const token = generateToken(user)
      return {
        ...user._doc, // instructor says _doc is for where our document is stored?? referring to mongodb and how it works?
        id: user._id,
        token,
      }
    },
    // we make register async and await password because bcrypt hashing is asynchronous
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
      const token = generateToken(res)

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
