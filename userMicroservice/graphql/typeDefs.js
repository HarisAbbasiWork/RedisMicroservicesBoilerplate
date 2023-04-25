const { ApolloServer, gql } = require('apollo-server-express');
const typeDefs = gql`
  type User {
    _id: ID!
    firstname: String
    lastname: String
    email: String
    password: String
    profilePic:String
    userName:String
  }
  type Post {
    id: ID!
    title: String
    body: String
    createdBy:User
  }
  type Comment {
    id: ID!
    text: String
    postId: Post
    createdBy:User
  }
  type createUserResponse {
    success: Boolean
    message: String
    user:User
  }
  type loginUserResponse {
    success: Boolean
    message: String
    user:User
    accessToken: String
    refreshToken: String
  }
  #GraphQL Query
  type Query {
    getUser: [User]
  }
  #GraphQl Mutation
  type Mutation {
    createUser(firstname: String, lastname: String, email: String, password: String, profilePic:String, userName:String):createUserResponse
    loginUser(email: String, password: String):loginUserResponse
    deleteMyAccount:loginUserResponse
  }
`;
module.exports = {
    typeDefs
}