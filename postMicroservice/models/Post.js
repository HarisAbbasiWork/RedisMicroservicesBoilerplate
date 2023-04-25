const mongoose = require('mongoose');
var Schema = mongoose.Schema;
var post = new Schema({
   "title": String,
   "body": String,
   "userId": {
      type: String,
      required: false
   },
   "isDeleted":Boolean
});
module.exports = mongoose.model('posts', post);