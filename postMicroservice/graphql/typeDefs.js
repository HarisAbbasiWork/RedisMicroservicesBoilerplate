const { ApolloServer, gql } = require('apollo-server-express');
const typeDefs = gql`
  type User {
    id: ID!
    name: String
    postCount: Int
  }
  type Post {
    _id: ID!
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
  type createPostResponse {
    id: ID!
    success: String
    message: String
    post:Post
  }
  type getPostsResponse {
    id: ID!
    success: String
    message: String
    posts:[Post]
  }
  #GraphQL Query
  type Query {
    getPostsOfUser(userId:ID): getPostsResponse
  }
  #GraphQl Mutation
  type Mutation {
    createPost(title:String,body:String):createPostResponse
  }
`;
module.exports = {
    typeDefs
}