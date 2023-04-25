const mongoose = require('mongoose');
var Schema = mongoose.Schema;
var user = new Schema({
   "firstname": String,
   "lastname": String,
   "email": {
      type: String,
      unique: false
   },
   "password": String,
   "userName": String,
   "profilePic": String,
   "isDeleted":Boolean
});
module.exports = mongoose.model('users', user);
//mongoose