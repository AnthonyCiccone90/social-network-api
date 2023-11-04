// Get all users
app.get('/api/users', (req, res) => {
  User.find()
    .populate('thoughts')
    .populate('friends')
    .exec((err, users) => {
      if (err) {
        res.status(500).json(err);
      } else {
        res.status(200).json(users);
      }
    });
});

// Get a single user by _id
app.get('/api/users/:id', (req, res) => {
  const userId = req.params.id;
  User.findById(userId)
    .populate('thoughts')
    .populate('friends')
    .exec((err, user) => {
      if (err) {
        res.status(500).json(err);
      } else {
        res.status(200).json(user);
      }
    });
});

// Create a new user
app.post('/api/users', (req, res) => {
  const userData = req.body;
  User.create(userData, (err, newUser) => {
    if (err) {
      res.status(500).json(err);
    } else {
      res.status(201).json(newUser);
    }
  });
});

// Update a user by _id
app.put('/api/users/:id', (req, res) => {
  const userId = req.params.id;
  const updatedData = req.body;
  User.findByIdAndUpdate(userId, updatedData, { new: true }, (err, updatedUser) => {
    if (err) {
      res.status(500).json(err);
    } else {
      res.status(200).json(updatedUser);
    }
  });
});

// Delete a user by _id
app.delete('/api/users/:id', (req, res) => {
  const userId = req.params.id;
  User.findByIdAndDelete(userId, (err) => {
    if (err) {
      res.status(500).json(err);
    } else {
      res.status(204).end();
    }
  });
});
