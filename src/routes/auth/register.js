const axios = require('axios');

module.exports = async (req, res) => {
    if (req.body.password !== req.body.confirmPass){
        res.send({error: "Your passwords do not match"})
        return
    }
    try{
        const mutation = `
            mutation register($email: String!, $username: String!, $password: String!){
                register(email:$email, username: $username, password: $password)
            }
        `
        const { data } = await axios.post(process.env.GRAPHQL_ENDPOINT, 
                {
                    query: mutation,
                    variables: {
                        email: req.body.email,
                        username: req.body.username,
                        password: req.body.password
                    }
                },
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );
        
        const jwtToken = data.data.register
        console.log(jwtToken);

        res.redirect('/')
    } catch(err){
        console.error(err);
        res.redirect('/auth/register')
    }
}