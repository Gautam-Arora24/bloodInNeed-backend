const Services = require("../Services/auth");
const { PubSub } = require("apollo-server");
const pubsub = new PubSub();
const newUserKey = "userKey";
const User = require("../MongooseSchema/userSchema");
const toBeAdded = true;

const resolvers = {
  Query: {
    userById: (parent, { _id }, context) => {
      const { user } = context;
      if (!user) {
        throw new Error("User not logged in");
      }
      return User.findById(_id);
    },
    usersWithSameBlood: async (parent, args, context) => {
      console.log("~~~ here ~~~", context);
      const { user } = context;
      if (!user) {
        throw new Error("User not logged in");
      }
      const reqUser = await User.findById(user._id);
      const allUsers = await User.find({
        bloodGroup: reqUser.bloodGroup,
        state: reqUser.state,
        city: reqUser.city,
        _id: { $ne: reqUser.id },
      });
      return allUsers;
    },
  },
  Mutation: {
    userAdded(
      parent,
      { emailId, name, phoneNumber, bloodGroup, password, state, city }
    ) {
      const user = Services.signup(
        emailId,
        name,
        phoneNumber,
        bloodGroup,
        password,
        state,
        city
      );
      return user;
    },
    async userLogin(parent, { emailId, password }) {
      const userDetails = await Services.login(emailId, password);
      const { token, user } = userDetails;
      return {
        token: token,
        user: user,
      };
    },
    async updateUser(parent, { state, city, bloodGroup }, context) {
      const { user } = context;
      if (!user) {
        throw new Error("User not logged in");
      }
      const updatedUser = await Services.updateUser(
        state,
        city,
        bloodGroup,
        user._id
      );
      return updatedUser;
    },
    async requestUser(parent, { _id }, context) {
      const { user } = context;
      if (!user) {
        return new Error("User not logged in");
      }
      const UserRequested = await User.findById(_id);
      console.log("INDEX", UserRequested.request.indexOf(user._id));
      if (!UserRequested.request.find(({ _id }) => _id == user._id)) {
        UserRequested.request.push(user);
      }

      return UserRequested.save();
    },
    async deleteRequest(parent, { _id, index }, context) {
      const { user } = context;
      if (!user) {
        return new Error("User not logged in");
      }
      const UserRequested = await User.findById(_id);
      UserRequested.request.splice(index, 1);
      return UserRequested.save();
    },
  },
};
module.exports = resolvers;
