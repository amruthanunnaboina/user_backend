const mongoose = require('mongoose');
console.log(" i am here i am here")
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  photo: { type: String, default: null },
  lastLoginTime: { type: Date, default: null },
  activityFeed: { type: [String], default: [] },
  friends: { type: [String], default: [] },
});

module.exports = mongoose.model('User', userSchema);
// i am here;wjqd