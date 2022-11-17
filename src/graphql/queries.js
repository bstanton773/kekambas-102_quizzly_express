// Import Types from GraphQL
const { GraphQLList, GraphQLID, GraphQLString } = require('graphql');
// Import our own created type
const { UserType, QuizType, SubmissionType } = require('./types');
// Import model so we can get data from MongoDB
const { User, Quiz, Submission } = require('../models');


const users = {
    type: new GraphQLList(UserType),
    description: 'Query all users from database',
    resolve(parent, args){
        return User.find()
    }
}

const user = {
    type: UserType,
    desciption: 'Query single user from database by id',
    args: {
        id: { type: GraphQLID }
    },
    resolve(parent, args){
        return User.findById(args.id)
    }
}


const quizBySlug = {
    type: QuizType,
    description: 'Query quiz by its slug',
    args: {
        slug: { type: GraphQLString }
    },
    resolve(parent, args){
        return Quiz.findOne({ slug: args.slug })
    }
}


const submissionById = {
    type: SubmissionType,
    description: 'Query submission by its ID',
    args: {
        id: { type: GraphQLID }
    },
    resolve(parent, args){
        return Submission.findById(args.id)
    }
}


module.exports = {
    users,
    user,
    quizBySlug,
    submissionById,
}
