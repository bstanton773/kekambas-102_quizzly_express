const axios = require('axios');

module.exports = async (req, res) => {
    let slug = req.params.slug

    const query = `
        query ($slug: String){
            quizBySlug(slug: $slug){
                id
                slug
                title
                description
                questions{
                    id
                    title
                    order
                    correctAnswer
                }
            }
        }
    `
    try{
        const { data } = await axios.post(
            process.env.GRAPHQL_ENDPOINT,
            {
                query,
                variables: { slug }
            },
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        )
        
        let quizData = data.data.quizBySlug

        res.render('quiz', { quiz: quizData })
    } catch(err){
        console.log(err)
    }
}
