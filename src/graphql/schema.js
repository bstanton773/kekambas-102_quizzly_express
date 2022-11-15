// Import schema from graphql
const {GraphQLSchema, GraphQLObjectType}=require(`graphql`)

const QueryType = new GraphQLObjectType(

    {name:'QueryType',
    description:'Queries',
    feilds:[]

}
)

module.exports = new GraphQLSchema({
    query:QueryType
})