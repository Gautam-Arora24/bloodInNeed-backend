const { ApolloServer } = require("apollo-server");
const express = require("express");
const mongoose = require("mongoose");
const typeDefs = require("./Schema/schema");
const resolvers = require("./Resolvers/resolver");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const app = express();

app.use(cors());
require("dotenv").config();
// DATABASE CONNECTION
mongoose
  .connect(
    process.env.MONGODB_URI || process.env.DATABASE,
    { useNewUrlParser: true },
    { useUnifiedTopology: true }
  )
  .then((res) => {
    console.log("Database Connected");
  });

const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true,
  playground: true,
  context: ({ req }) => {
    // get the user token from the headers
    const token = req.headers.authorization || "";
    console.log("token", token);
    if (token === "") {
      console.log("exited here");
      return;
    }
    // try to retrieve a user with the token
    console.log("reached here");
    let user = {};
    try {
      user = jwt.verify(token, process.env.SECRET || process.env.APP_SECRET);
    } catch (e) {
      console.log(e);
    }
    console.log("user", user);

    // optionally block the user
    // we could also check user roles/permissions here
    // if (!user) throw new AuthenticationError("you must be logged in");
    // add the user to the context
    return { user };
  },
});

// The `listen` method launches a web server.
server.listen({ port: process.env.PORT || 4000 }).then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
