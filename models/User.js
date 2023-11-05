const mongoose = require('mongoose');
const { Schema } = mongoose;
const Friend = require('./Friend');


const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
  },
  thoughts: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Thought',
    },
  ],
  friends: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Friend',
    },
  ],
});

userSchema.statics.customCreate = function (userData) {
  return new Promise((resolve, reject) => {
    const User = this;
    const newUser = new User(userData);

    newUser.save()
      .then((newUser) => {
        resolve(newUser);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

userSchema.virtual('friendCount').get(function () {
  return this.friends.length;
});


const User = mongoose.model('User', userSchema);

module.exports = User;


