// Import Types from GraphQL
const { GraphQLList } = require('graphql');
// Import our own created type
const { UserType } = require('./types');
// Import model so we can get data from MongoDB
const { User } = require('../models');


const users = {
    type: new GraphQLList(UserType),
    description: 'We are going to get every single user from the database and display it here',
    resolve(parents, args){
        return User.find()
    }
}


module.exports = {
    users
}
