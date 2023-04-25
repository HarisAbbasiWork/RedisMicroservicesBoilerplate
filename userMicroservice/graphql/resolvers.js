const { Signup, Login, deleteMyAccountFunction } = require("../helpers/userFunctions");

const resolvers = {
    Query: {
        getUser: () => {
            return users
        },

    },
    Mutation: {
        createUser: async (parent, args, context, info) => {
            console.log("User args", args);
            var { firstname, lastname, email, password, profilePic, userName } = args
            var response = await Signup(firstname, lastname, email, password, profilePic, userName)
            return response
        },
        loginUser: async (parent, args, context, info) => {
            console.log("Post args", args);
            var { email, password } = args
            var response = await Login(email, password)
            return response
        },
        deleteMyAccount: async (parent, args, context, info) => {
            console.log("Post args", args);
            if (!context.user) {
                return {
                    success: false,
                    message: 'Token Expired',
                    isTokenExpired: true
                };
            }
            var userId = context.user
            var response = await deleteMyAccountFunction(userId)
            return response
        }
    }

};
module.exports = {
    resolvers
}