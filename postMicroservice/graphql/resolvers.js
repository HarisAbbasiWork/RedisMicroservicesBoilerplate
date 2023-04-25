var users = [
  { id: "1", name: "Usama", postCount: 1 },
  { id: "2", name: "Haris", postCount: 1 },
  { id: "3", name: "Haseeb", postCount: 1 }
]
var posts = [
  { id: "1", title: "Post title 1", body: "Post body 1", userId: "1" },
  { id: "2", title: "Post title 2", body: "Post body 2", userId: "2" },
  { id: "3", title: "Post title 3", body: "Post body 3", userId: "3" },
]
var comments = [
  { id: "1", text: "comment 1", postId: "2", createdBy: "1" },
  { id: "2", text: "comment 1", postId: "2", createdBy: "1" },
  { id: "3", text: "comment 1", postId: "2", createdBy: "1" },
]
const { createPostFunction } = require('../helpers/postFunctions');
const { publisher, subscriber } = require('../redis/redisConnection');
publisher.connect()
const resolvers = {
  Query: {
    getPostsOfUser: (parent, args, context, info) => {
      console.log(args)
      return posts.filter(post => post.userId == args.id)
    }

  },
  Mutation: {
    createPost: async (parent, args, context, info) => {
      console.log("Post args", args);
      var { title, body } = args
      if (!context.user) {
        return {
          success: false,
          message: 'Token Expired',
          isTokenExpired: true
        };
      }
      var userId = context.user
      var response = await createPostFunction(title, body, userId);
      return response
    }
  }

};
module.exports = {
  resolvers
}