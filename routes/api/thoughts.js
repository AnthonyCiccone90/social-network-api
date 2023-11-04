


// Get all thoughts
app.get('/thoughts', async (req, res) => {
    try {
        const users = await Thought.find().populate('thoughts friends');
        res.json(users);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
})

// Get single thought
app.get('/thoughts/:id', async (req, res) => {
    try {
      const user = await Thought.findById(req.params.id)
        .populate('thoughts friends');
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json(user);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server Error' });
    }
  });


// Post new thought
app.post('/thoughts', async (req, res) => {
    try {
      const newUser = await Thought.create(req.body);
      res.status(201).json(newUser);
    } catch (err) {
      console.error(err);
      res.status(400).json({ message: 'Invalid request' });
    }
});
  
app.post('/api/thoughts/:thoughtId/', (req, res) => {
  const thoughtId = req.params.thoughtId;
  const reactionData = req.body;

  // Create a new reaction
  Thought.findByIdAndUpdate(
    thoughtId,
    { $push: { reactions: reactionData } },
    { new: true },
    (err, updatedThought) => {
      if (err) {
        res.status(500).json(err);
      } else {
        res.status(200).json(updatedThought);
      }
    }
  );
});

app.delete('/api/thoughts/:thoughtId/reactions/:reactionId', (req, res) => {
  const thoughtId = req.params.thoughtId;
  const reactionId = req.params.reactionId;

  // Remove the reaction by reactionId
  Thought.findByIdAndUpdate(
    thoughtId,
    { $pull: { reactions: { reactionId: reactionId } } },
    { new: true },
    (err, updatedThought) => {
      if (err) {
        res.status(500).json(err);
      } else {
        res.status(200).json(updatedThought);
      }
    }
  );
});

