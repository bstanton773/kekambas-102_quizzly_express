const { GraphQLString } = require('graphql');
const { User } = require('../models');
const { createJwtToken } = require('../util/auth');
const bcrypt = require('bcrypt');


const register = {
    type: GraphQLString,
    description: "Register a new user",
    args: {
        username: { type: GraphQLString },
        email: { type: GraphQLString },
        password: { type: GraphQLString }
    },
    async resolve(parent, args){
        const checkUser = await User.findOne({ email: args.email })
        if (checkUser){
            throw new Error("User with this email address already exists")
        }

        const { username, email, password } = args;
        // Hash password before creating new user
        const passwordHash = await bcrypt.hash(password, 10);

        const user = new User({ username, email, password: passwordHash });

        await user.save();

        const token = createJwtToken(user)
        return token;
    }
}


const login = {
    type: GraphQLString,
    description: "Log a user in with email and password",
    args: {
        email: { type: GraphQLString },
        password: { type: GraphQLString }
    },
    async resolve(parent, args){
        const user = await User.findOne({ email: args.email })
        const correctPassword = await bcrypt.compare(args.password, user.password);
        if (!user || !correctPassword){
            throw new Error('Invalid Credentials')
        }

        const token = createJwtToken(user);
        return token;
    }
}

module.exports = {
    register,
    login
}
