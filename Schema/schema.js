const { gql } = require("apollo-server");

const typeDefs = gql`
  type User {
    _id: ID!
    name: String
    emailId: String
    phoneNumber: String
    bloodGroup: String
    password: String
    state: String
    city: String
    request: [User]
  }
  type Point {
    type: Float
  }
  type Query {
    userById(_id: String): User!
    usersWithSameBlood(bloodGroup: String): [User]!
    notification: [User]
  }
  type AuthPayload {
    token: String!
    user: User!
  }
  type Mutation {
    userAdded(
      emailId: String
      name: String
      phoneNumber: String
      bloodGroup: String
      password: String
      state: String
      city: String
    ): User!
    userLogin(emailId: String, password: String): AuthPayload!
    updateUser(state: String, city: String, bloodGroup: String): User
    requestUser(_id: String): User
    deleteRequest(_id: String, index: Int): User
  }
`;

module.exports = typeDefs;
