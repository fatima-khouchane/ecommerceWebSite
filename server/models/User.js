const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  
  role: {
    type: Number,
    default: 0, //0 -> acheteur   1-> vendeuse   ...
  },
});

const User = mongoose.model("User", UserSchema);

module.exports = { User };
