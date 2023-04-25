const Post = require("../models/Post");
const User = require("../models/Post");
const saltRounds = 10;
async function createPostFunction(title, body, userId) {
    try {
        //console.log("req.body is", req.body);
        //const result = await authSchema.validateAsync(req.body)
        //checking if user exists
        console.log("title,body ", title, body)
        if (!title && !body) {

            return {
                success: false,
                message: "Title and body is required for post."
            };
        } else {
            var newPost;
            newPost = await new Post({
                title: title,
                body: body,
                userId: userId
            }).save()
            if (newPost) {
                console.log("Post is live", newPost)
                return {
                    success: true,
                    message: "Post is live.",
                    post: newPost,

                };
            } else {
                return {
                    success: false,
                    message: "Post couldn't be created"
                };
            }
        }
    } catch (err) {
        console.log("err ", err)
        return {
            success: false,
            message: "Internal Server Error"
        }
    }
}
async function deletePostOfUser(userId) {
    try {
        //console.log("req.body is", req.body);
        //const result = await authSchema.validateAsync(req.body)
        //checking if user exists
        const deletedPosts = await Post.updateMany(
            { userId: userId },
            {
                $set: {
                    isDeleted: true,
                }
            },
            { new: true }
        );
        console.log("deletedPosts ", deletedPosts)
        return {
            success: true,
            message: "Posts has been deleted"
        }
    } catch (err) {
        console.log("err ", err)
        return {
            success: false,
            message: "Internal Server Error"
        }
    }
}
module.exports = {
    createPostFunction,
    deletePostOfUser
}