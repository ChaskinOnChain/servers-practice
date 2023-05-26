# Express & Node.js REST API Cheat Sheet

## Setting Up the Server

```javascript
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
```

## Middleware

Middleware functions have access to the request object (req), the response object (res), and the next middleware function in the application’s request-response cycle. Middleware functions can perform tasks like modifying the req and res objects, end the request-response cycle, or call the next middleware function in the stack.

### Express Middleware

To parse incoming request bodies, use `express.json()` and `express.urlencoded()` for URL-encoded data.

```javascript
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
```

### Custom Middleware

```javascript
app.use((req, res, next) => {
  console.log("${req.method} ${req.originalUrl}");
  next();
});
```

### CORS Middleware

To handle Cross-Origin Resource Sharing (CORS), install and use the `cors` middleware.

```bash
npm install cors
```

```javascript
const cors = require("cors");
app.use(cors());
```

## Router Functionality

### Create a Router

```javascript
const express = require("express");
const router = express.Router();
```

### Define Routes Using Router

```javascript
router.get("/", (req, res) => {
  res.send("Welcome to the API");
});
module.exports = router;
```

### Mount the Router

```javascript
const apiRoutes = require("./routes/apiRoutes");
app.use("/api", apiRoutes);
```

## Handling Routes

A route method is derived from an HTTP method, and is attached to an instance of the express class.

### GET Request

```javascript
router.get("/users", async (req, res) => {
  const users = await User.find();
  res.json(users);
});
```

### POST Request

```javascript
router.post("/users", async (req, res) => {
  const newUser = new User(req.body);
  const savedUser = await newUser.save();
  res.json(savedUser);
});
```

### PUT Request

```javascript
router.put("/users/:id", async (req, res) => {
  const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  }); // {new: true} returns the updated user
  res.json(updatedUser);
});
```

### DELETE Request

```javascript
router.delete("/users/:id", async (req, res) => {
  const deletedUser = await User.findByIdAndDelete(req.params.id);
  res.json(deletedUser);
});
```

## Error Handling

Middleware to handle errors and provide custom error responses should be loaded last.

```javascript
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});
```

Remember to replace `User` and `users` with your actual model and data and implement the corresponding database operations.

Express is a minimal framework, so many features are implemented as middleware, including features of HTTP. For more features, look into middleware like helmet for security headers, morgan for log generation, compression for gzip compression, express-session for session management, connect-flash for flash messages, and so on.

# Mongoose Cheat Sheet

## Connecting to the Database

```javascript
const mongoose = require("mongoose");
const uri = process.env.MONGO_URI;

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
```

## Creating a Schema

```javascript
const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  name: String,
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});
```

## Creating a Model

```javascript
const User = mongoose.model("User", userSchema);
```

## Creating a New Document

```javascript
const newUser = new User({
  name: "John Doe",
  email: "john@example.com",
  password: "password123",
});

newUser.save();
```

## Querying for Documents

### Find All Documents

```javascript
User.find();
```

### Find Specific Documents

```javascript
User.find({ name: "John Doe" });
```

## Updating a Document

```javascript
User.updateOne({ name: "John Doe" }, { name: "Jane Doe" });
```

## Deleting a Document

```javascript
User.deleteOne({ name: "Jane Doe" });
```

## Other Useful Features

### Validation

You can include validation in your schema:

```javascript
const userSchema = new Schema({
email: {
type: String,
required: true,
unique: true,
validate: {
validator: function(v) {
return /.+@.+\..+/.test(v);
},
message: props => \`${props.value} is not a valid email!\`
}
}
});
```

### Middleware

Mongoose allows you to run middleware during certain stages of the document lifecycle:

```javascript
userSchema.pre("save", function (next) {
  // this function runs before saving a User
  next();
});
```

### Populate

If you have a schema with references to other schemas, you can automatically replace the saved ObjectId with the actual data:

```javascript
const userSchema = new Schema({
  name: String,
  posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
});

User.findOne({ name: "John Doe" })
  .populate("posts")
  .exec(function (err, user) {
    console.log(user.posts);
  });
```

# Mongoose, Express, and Node.js Cheat Sheet

## Request Cycle for API Routes

### Import Required Modules

```javascript
import express, { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import Goal from "../models/goalModel";
```

### Define API Routes

```javascript
const router = express.Router();

// Get all goals
router.get(
  "/goals",
  asyncHandler(async (req: Request, res: Response) => {
    const goals = await Goal.find();
    res.status(200).json(goals);
  })
);

// Create a new goal
router.post(
  "/goals",
  asyncHandler(async (req: Request, res: Response) => {
    const { text } = req.body;

    if (!text) {
      res.status(400).json({ error: "Text field is required" });
      return;
    }

    const goal = await Goal.create({ text });
    res.status(201).json(goal);
  })
);

// Update a goal
router.put(
  "/goals/:id",
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { text } = req.body;

    const goal = await Goal.findById(id);

    if (!goal) {
      res.status(404).json({ error: "Goal not found" });
      return;
    }

    goal.text = text || goal.text;
    const updatedGoal = await goal.save();
    res.status(200).json(updatedGoal);
  })
);

// Delete a goal
router.delete(
  "/goals/:id",
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const goal = await Goal.findById(id);

    if (!goal) {
      res.status(404).json({ error: "Goal not found" });
      return;
    }

    await goal.deleteOne({ _id: req.params.id });
    res.status(200).json({ message: "Goal deleted successfully" });
  })
);
```

### Mount the Router

```javascript
const app = express();
app.use(express.json());
app.use("/api", router);
```

## Explanation

1. Import the necessary modules, including Express, Request, Response, asyncHandler, and the Goal model.
2. Define the API routes using the Express Router.
3. Handle the GET request to retrieve all goals from the database. Use `Goal.find()` to fetch all documents and send them back as the response.
4. Handle the POST request to create a new goal. Extract the `text` field from the request body. Check if the `text` field is provided; otherwise, send a 400 response with an error message. Use `Goal.create()` to create a new goal document with the provided text and send it back as the response.
5. Handle the PUT request to update a goal. Extract the goal ID from the request parameters and the updated text from the request body. Find the goal by ID using `Goal.findById()`. If the goal doesn't exist, send a 404 response with an error message. Update the goal's `text` property with the provided text or keep it unchanged. Save the updated goal using `goal.save()` and send it back as the response.
6. Handle the DELETE request to delete a goal. Extract the goal ID from the request parameters. Find the goal by ID using `Goal.findById()`. If the goal doesn't exist, send a 404 response with an error message. Remove the goal using `Goal.deleteOne({_id: req.params.id}` and send a 200 response with a success message.
7. Mount the router in the main Express application using `app.use('/api',router)`.

# JWT and bcrypt Cheat Sheet

## Packages required:

- `jsonwebtoken`
- `bcryptjs`
- `express`
- `mongoose`
- `dotenv`

Use npm to install them:

```bash
npm install jsonwebtoken bcryptjs express mongoose dotenv
```

## User Model (`models/User.js`)

```javascript
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
});

UserSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 8);
  }
  next();
});

module.exports = mongoose.model("User", UserSchema);
```

## Authentication middleware (`middleware/auth.js`)

```javascript
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({
      _id: decoded._id,
      "tokens.token": token,
    });

    if (!user) {
      throw new Error();
    }

    req.token = token;
    req.user = user;
    next();
  } catch (e) {
    res.status(401).send({ error: "Please authenticate." });
  }
};

module.exports = auth;
```

## User routes (`routes/user.js`)

```javascript
const express = require("express");
const User = require("../models/User");
const auth = require("../middleware/auth");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const router = new express.Router();

// User signup
router.post("/users", async (req, res) => {
  const user = new User(req.body);

  try {
    await user.save();
    const token = await user.generateAuthToken();
    res.status(201).send({ user, token });
  } catch (e) {
    res.status(400).send(e);
  }
});

// User login
router.post("/users/login", async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await user.generateAuthToken();
    res.send({ user, token });
  } catch (e) {
    res.status(400).send();
  }
});

// User logout
router.post("/users/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });
    await req.user.save();

    res.send();
  } catch (e) {
    res.status(500).send();
  }
});

// User profile
router.get("/users/me", auth, async (req, res) => {
  res.send(req.user);
});

module.exports = router;
```

## In the user model, define `generateAuthToken()` and `findByCredentials()` (`models/User.js`)

```javascript
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

UserSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET);

  user.tokens = user.tokens.concat({ token });
  await user.save();

  return token;
};

UserSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email });
```

Please note that the code snippets are incomplete and need to be completed according to your application logic. Specifically, the findByCredentials function is not finished. It should look something like this:

```javascript
UserSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("Unable to login");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error("Unable to login");
  }

  return user;
};
```
