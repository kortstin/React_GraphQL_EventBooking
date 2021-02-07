require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { graphqlHTTP } = require('express-graphql');
const mongoose = require('mongoose');

const graphqlSchema = require('./graphql/schema/index');
const graphqlResolvers = require('./graphql/resolvers/index');
const isAuth = require('./middleware/is-auth');

const app = express();

const uri = process.env.ATLAS_URI;

app.use(bodyParser.json());

app.use(isAuth);

app.use('/graphql', graphqlHTTP({
    schema: graphqlSchema,
    rootValue: graphqlResolvers,
    graphiql: true
}));


mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
});

const connection = mongoose.connection;
connection.once('open', () => {
    console.log("MongoDB database connection established successfully");
})

app.listen(3000);