const User = require("../MongooseSchema/userSchema");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const browserEnv = require("browser-env");
browserEnv(["navigator"]);

function signup(emailId, name, phoneNumber, bloodGroup, password, state, city) {
  const user = new User({
    emailId,
    password,
    name,
    phoneNumber,
    bloodGroup,
    state,
    city,
  });
  if (
    !emailId ||
    !password ||
    !name ||
    !phoneNumber ||
    !bloodGroup ||
    !state ||
    !city
  ) {
    throw new Error("You must provide all the fields.");
  }
  if (password.length < 8) {
    throw new Error(
      "You must provide a password which is atleast 8 characters long"
    );
  }
  return User.findOne({ emailId })
    .then((existingUser) => {
      if (existingUser) {
        throw new Error("Email is in use");
      }
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(password, salt);
      user.password = hash;
      return user.save();
    })
    .catch((err) => {
      throw new Error(err);
    });
}

async function login(emailId, password) {
  const user = await User.findOne({ emailId });

  if (!user) {
    throw new Error("No user found with this EmailID");
  }
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    throw new Error("Invalid Password");
  }

  const token = await jwt.sign(
    { _id: user._id, name: user.name, phoneNumber: user.phoneNumber },
    process.env.SECRET || process.env.APP_SECRET
  );
  return {
    user,
    token,
  };
}

async function updateUser(state, city, bloodGroup, id) {
  const user = await User.findById({ _id: id });
  if (state) {
    user.state = state;
  }
  if (city) {
    user.city = city;
  }
  if (bloodGroup) {
    user.bloodGroup = bloodGroup;
  }
  user.save();
  return user;
}

module.exports = { signup, login, updateUser };
