const User = require("../models/User");
const saltRounds = 10;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { ObjectId } = require('mongodb');
const { publisher, subscriber } = require('../redis/redisConnection');
publisher.connect()
async function Signup(firstname, lastname, email, password, profilePic, userName) {
    try {
        //console.log("req.body is", req.body);
        //const result = await authSchema.validateAsync(req.body)
        //checking if user exists
        if (email) {
            email = email.toLowerCase();
        }

        var ifuser;
        if (email) {
            ifuser = await User.findOne({ email: email });
            if (ifuser) {
                return {
                    success: false,
                    message: "User Already Exists with this email"
                };
            }
        }
        console.log("ifuser ", ifuser)
        if (ifuser) {
            console.log(ifuser)

            return {
                success: false,
                message: "User Already Exists with this email"
            };
        } else {
            //encrypting user password
            console.log("password, saltRounds ", password, saltRounds);
            const encryptedPassword = await bcrypt.hash(password, saltRounds)
            //saving user to DB
            console.log("encryptedPassword", encryptedPassword)
            var newUser;
            newUser = await new User({
                firstname: firstname,
                lastname: lastname,
                email: email,
                password: encryptedPassword,
                profilePic: profilePic,
                userName: userName
            }).save()
            if (newUser) {
                console.log("You are now user", newUser)
                return {
                    success: true,
                    message: "Congratulations, you have successfully completed the registration.",
                    user: newUser,

                };
            } else {
                return {
                    success: false,
                    message: "User couldn't be created"
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
async function Login(email, password) {
    try {
        console.log("email, password ", email, password)

        var user
        if (email) {
            email = email.toLowerCase();
            user = await User.findOne({ email: email })
        }
        console.log("User ", user)
        if (user) {
            console.log("bycrypt ", await bcrypt.compare(password, user.password))
            if (await bcrypt.compare(password, user.password)) {
                var id = user._id
                const accessToken = jwt.sign({ id }, process.env.JWT_SECRET, {
                    expiresIn: '1.5h'
                });
                const refreshToken = jwt.sign({ id }, process.env.JWT_SECRET, {
                    expiresIn: '30d'
                });

                return {
                    success: true,
                    message: 'Login Successful.',
                    user: user,
                    accessToken: accessToken,
                    refreshToken: refreshToken,
                };
            } else {
                return {
                    success: false,
                    message: "Email and Password does not match."
                };
            }
        } else {
            console.log("Invalid User");
            return {
                success: false,
                message: 'User does not exist.'
            };
        }

    } catch (err) {
        console.log("err ", err)
        return {
            success: false,
            message: "Internal Server Error"
        }
    }

}
async function deleteMyAccountFunction(userId) {
    try {
        console.log("userId", userId)

        var user = await User.findOne({ _id: userId })
        console.log("User ", user)
        if (user) {
            const deletedUser = await User.findOneAndUpdate(
                { _id: userId },
                {
                    $set: {
                        isDeleted: true,
                    }
                },
                { new: true }
            );
            console.log("deletedUser ", deletedUser)
            if (deletedUser) {
                var publishEvent = {
                    type: 'deleteUserPosts',
                    id: userId
                }
                publisher.publish("serviceTwoEvents", JSON.stringify(publishEvent))
                return {
                    success: true,
                    message: 'User has been deleted'
                };
            }

        } else {
            console.log("Invalid User");
            return {
                success: false,
                message: 'User does not exist.'
            };
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
    Signup,
    Login,
    deleteMyAccountFunction
}