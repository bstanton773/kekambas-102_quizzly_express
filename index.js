const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const app = express();
const port = process.env.PORT;
const path = require('path');
const { connectDB } = require('./src/db');
const { graphqlHTTP } = require('express-graphql');
const schema = require('./src/graphql/schema')

// Execute the connectDB function to connect to our database
connectDB();

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
    res.send('Hello World')
})

// Import function to initialize routes
const initRoutes = require('./src/routes');
// Call the initRoutes function with the app
initRoutes(app);

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`)
})

