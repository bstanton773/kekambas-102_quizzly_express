const { GraphQLString, GraphQLID, GraphQLNonNull, GraphQLList } = require('graphql');
const { User, Quiz, Question, Submission } = require('../models');
const { QuestionInputType, AnswerInputType } = require('./types');
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


const createQuiz = {
    type: GraphQLString,
    args: {
        title: {
            type: GraphQLString
        },
        description: {
            type: GraphQLString
        },
        userId: {
            type: GraphQLID
        },
        questions: {
            type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(QuestionInputType)))
        }
    },
    async resolve(parent, args){
        // Generate a slug for our quiz
        let slugify = args.title.toLowerCase().replace(/[^\w ]+/g, '').replace(/ +/g, '-')
        /*
        Add a random integer to the end of the slug, check that the slug does not already exist
        if it does, generate a new slug number
        */
        let fullSlug;
        while(true){
            let slugId = Math.floor(Math.random() * 10000);
            fullSlug = `${slugify}-${slugId}`;

            const existingQuiz = await Quiz.findOne({ slug: fullSlug })
            if (!existingQuiz){
                break;
            }
        }

        const quiz = new Quiz({
            title: args.title,
            slug: fullSlug,
            description: args.description,
            userId: args.userId
        })

        await quiz.save()

        // Loop through all of the QuestionInputs and create a new Question instance with the quiz id
        for (let question of args.questions){
            const newQuestion = new Question({
                title: question.title,
                correctAnswer: question.correctAnswer,
                order: Number(question.order),
                quizId: quiz.id
            })
            await newQuestion.save()
        }

        // Return the slug
        return quiz.slug
    }
}


const submitQuiz = {
    type: GraphQLID,
    description: "Submit a quiz",
    args: {
        userId: { type: GraphQLID },
        quizId: { type: GraphQLID },
        answers: { type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(AnswerInputType)))}
    },
    async resolve(parent, args){
        try{
            let correct = 0;
            let totalScore = args.answers.length;

            for (const answer of args.answers){
                const question = await Question.findById(answer.questionId);
                if ( answer.answer.trim().toLowerCase() === question.correctAnswer.trim().toLowerCase() ){
                    correct++
                }
            }

            const score = ( correct / totalScore ) * 100;

            const submission = new Submission({
                userId: args.userId,
                quizId: args.quizId,
                score
            })

            await submission.save()

            return submission.id

        } catch(err){
            console.log(err)
        }
    }
}


module.exports = {
    register,
    login,
    createQuiz,
    submitQuiz
}
