const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const app = express();
const port = process.env.PORT;
const path = require('path');
const { connectDB } = require('./src/db');
const { graphqlHTTP } = require('express-graphql');
const schema = require('./src/graphql/schema');
const cookieParser = require('cookie-parser');
const { authenticate } = require('./src/middleware/auth');
const { userData } = require('./src/middleware/userData');

// Execute the connectDB function to connect to our database
connectDB();

// Add cookie-parser middleware to add cookie headers to req.cookie
app.use(cookieParser());

// Add authentication middleware that will check for jwt token and either redirect
// to login or add req.verifiedUser
app.use(authenticate);

// Add userData middleware to add quizzes onto the req.verifiedUser (if there is one)
// *Must be AFTER authenticate middleware
app.use(userData);

// Add graphql middleware to app
app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true
}))

app.set('view engine', 'ejs')
// Update the location of the folder for the res.render to use
app.set('views', path.join(__dirname, 'src/templates/views'))

// Set up middleware to parse form data and add to request body
app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => {
    res.render('dashboard')
})

// Import function to initialize routes
const initRoutes = require('./src/routes');
// Call the initRoutes function with the app
initRoutes(app);

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`)
})

