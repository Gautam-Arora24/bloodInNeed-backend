const mongoose = require("mongoose");
const schema = mongoose.Schema;

const UserSchema = new schema({
  name: {
    type: String,
    required: true,
  },
  emailId: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  bloodGroup: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  request: [
    {
      name: {
        type: String,
      },
      phoneNumber: {
        type: String,
      },
    },
  ],
});

const User = mongoose.model("User", UserSchema);
module.exports = User;
