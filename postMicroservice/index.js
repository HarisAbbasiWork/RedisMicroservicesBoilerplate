require("dotenv").config();
const { ApolloServer, gql } = require('apollo-server-express');
const express = require('express');
var http = require("http");
const { ApolloServerPluginDrainHttpServer, ApolloServerPluginLandingPageLocalDefault, ApolloServerPluginLandingPageGraphQLPlayground } = require('apollo-server-core');
const { resolvers } = require('./graphql/resolvers.js');
const { typeDefs } = require('./graphql/typeDefs.js');
const path = require('path')
var jwt = require('jsonwebtoken');
const { publisher, subscriber } = require('./redis/redisConnection');
subscriber.connect()
const mongoose = require('mongoose');
const { deletePostOfUser } = require("./helpers/postFunctions.js");
async function run() {
  const app = express();
  const httpServer = http.createServer(app);
  const server = new ApolloServer({
    typeDefs, resolvers,
    context: async ({ req }) => {
      // Note: This example uses the `req` argument to access headers,
      // but the arguments received by `context` vary by integration.
      // This means they vary for Express, Koa, Lambda, etc.
      //
      // To find out the correct arguments for a specific integration,
      // see https://www.apollographql.com/docs/apollo-server/api/apollo-server/#middleware-specific-context-fields

      // Get the user token from the headers.
      const token = req.headers.authorization || '';
      //console.log("token ",token)
      var user;
      var isAdmin;
      if (!token) {
        return null
      } else {
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
          if (err) {
            console.log("you failed authenticate",err)
            user = null
          } else {
            console.log("decoded ",decoded)
            //console.log("you authenticated",decoded.id)
            user = decoded.id
            isAdmin = decoded.isAdmin
          }
        })
      }
      console.log("user ", user, " isAdmin ", isAdmin)
      return { user, isAdmin };
    },
    plugins: [ApolloServerPluginLandingPageGraphQLPlayground(), ApolloServerPluginDrainHttpServer({ httpServer })],

    playground: true
  });
  // The `listen` method launches a web server.
  console.log("process.env.PORT ", process.env.PORT, process.env.HOST);
  await server.start();
  server.applyMiddleware({ app, path: '/service2' });
  // this._server = server.listen({ port: process.env.PORT || 4000 }).then(({ url }) => {
  //     console.log(`:rocket:  Server ready at ${url}`);
  // });
  await httpServer.listen({ port: process.env.PORT || 4000 });
  console.log(`🚀 Server ready at http://localhost:${process.env.PORT}${server.graphqlPath}`);
}
async function subscribeService() {

  await subscriber.subscribe('serviceTwoEvents', async(message) => {
    console.log(message); // 'message'
    message=JSON.parse(message)
    if(message.type=='deleteUserPosts'){
      console.log("deletePostOfUser ",message.id)
      var deletePosts=await deletePostOfUser(message.id)
      console.log("deletePosts ",deletePosts)
    }
  });
}
async function connectDb() {
  try {
      const { DB_NAME, USERR, PASS } = process.env;
      console.log('DB_NAME,USERR,PASS ', DB_NAME, USERR, PASS);
      this.db = await mongoose.connect(
          `mongodb+srv://${process.env.USERR}:${process.env.PASS}@cluster0.afugsth.mongodb.net/myFirstDatabase?retryWrites=true`,
          {
              dbName: process.env.DB_NAME,
              user: process.env.USERR,
              pass: process.env.PASS,
              useNewUrlParser: true,
              useUnifiedTopology: true,
          }
      );
      console.log('db connected');
  } catch (err) {
      console.log('mongoerror');
      throw new Error(err.message);
  }
}
run()
subscribeService()
connectDb()
console.log("hello World!!!");