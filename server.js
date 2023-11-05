const express = require("express");
const { MongoClient } = require("mongodb");
const db = require("./config/connection");
const User = require("./models/User");
const Thought = require("./models/Thought");

const app = express();
const PORT = 3001;

const connectionStringURI = `mongodb://127.0.0.1:27017`;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const client = new MongoClient(connectionStringURI);

// Get all users
app.get("/users", async (req, res) => {
  try {
    const users = await User.find().populate("thoughts friends");
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

// Get a single user by id
app.get("/users/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId)
      .populate("thoughts")
      .populate("friends")
      .exec();

    if (!user) {
      return res.status(404).json({ message: "Thought not found" });
    }

    res.status(200).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

// Create a new user
app.post("/users", (req, res) => {
  const userData = req.body;
  User.customCreate(userData)
    .then((newUser) => {
      res.status(201).json(newUser);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

// Update a user by id
app.put("/users/:id", (req, res) => {
  const userId = req.params.id;
  const updatedData = req.body;

  User.findByIdAndUpdate(userId, updatedData, { new: true }) 
    .then((updatedUser) => {
      res.status(200).json(updatedUser);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

// Delete a user by id
app.delete("/users/:id", (req, res) => {
  const userId = req.params.id;
  User.findByIdAndDelete(userId)
    .then((result) => {
      if (!result) {
        res.status(404).json({ message: "User not found" });
      } else {
        res.json({ message: "User deleted" });
      }
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

// Get all thoughts
app.get("/thoughts", async (req, res) => {
  try {
    const thoughts = await Thought.find().populate("reactions");
    res.json(thoughts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

// Get single thought by id
app.get("/thoughts/:id", async (req, res) => {
  try {
    const thoughtId = req.params.id;
    const thought = await Thought.findById(thoughtId)
      .populate("reactions")
      .exec();

    if (!thought) {
      return res.status(404).json({ message: "Thought not found" });
    }

    res.status(200).json(thought);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

// Post new thought
app.post("/thoughts", async (req, res) => {
  try {
    const newThought = await Thought.create(req.body);
    res.status(201).json(newThought);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "Invalid request" });
  }
});

// Updates thought by id
app.put("/thoughts/:id", async (req, res) => {
  try {
    const thoughtId = req.params.id;
    const updatedThoughtData = req.body;

    const updatedThought = await Thought.findByIdAndUpdate(
      thoughtId,
      updatedThoughtData,
      { new: true }
    );

    if (!updatedThought) {
      return res.status(404).json({ message: "Thought not found" });
    }

    res.status(200).json(updatedThought);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

// Deletes thoughts by id
app.delete("/thoughts/:thoughtId", async (req, res) => {
  const thoughtId = req.params.thoughtId;

  try {
    const deletedThought = await Thought.findByIdAndDelete(thoughtId);

    if (!deletedThought) {
      return res.status(404).json({ message: "Thought not found" });
    }

    res.status(200).json({ message: "Thought deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

// Create reaction
app.post("/thoughts/:thoughtId/reactions", async (req, res) => {
  const thoughtId = req.params.thoughtId;
  const reactionData = req.body;

  try {
    const updatedThought = await Thought.findByIdAndUpdate(
      thoughtId,
      { $push: { reactions: reactionData } },
      { new: true }
    );

    if (!updatedThought) {
      return res.status(404).json({ message: "Thought not found" });
    }

    res.status(201).json(updatedThought);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

// Delete a reaction from a thought
app.delete("/thoughts/:thoughtId/reactions/:reactionId", async (req, res) => {
  const thoughtId = req.params.thoughtId;
  const reactionId = req.params.reactionId;

  try {
    const updatedThought = await Thought.findByIdAndUpdate(
      thoughtId,
      { $pull: { reactions: { _id: reactionId } } },
      { new: true }
    );

    if (!updatedThought) {
      return res.status(404).json({ message: "Thought not found" });
    }

    res.status(200).json({ message: "Reaction deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

db.once("open", () => {
  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
  });
});
