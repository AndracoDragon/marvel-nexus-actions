const express = require('express');
const cors = require('cors');

const { createBookmark, getBookmarks } = require('../actions/bookmark');
const { addEvent, getEvents } = require('../actions/event-log');
const { updateRelationship, getRelationships } = require('../actions/relationship-log');
const { updateLocation, getLocations } = require('../actions/location-log');

const {
  addEvent,
  updateRelationship,
  updateLocation

const app = express();
app.use(cors());
app.use(express.json());

// Root check
app.get('/', (req, res) => {
  res.json({ message: 'Marvel Nexus API is live' });
});

// Bookmark endpoint
app.post('/bookmark', (req, res) => {
  const { title, summary } = req.body;
  if (!title || !summary) return res.status(400).json({ error: 'Missing title or summary' });
  const result = createBookmark(title, summary);
  res.json(result);
});

app.get('/bookmark', (req, res) => {
  const bookmarks = getBookmarks();
  res.json(bookmarks);
});

// Event log endpoint
app.post('/log/event', (req, res) => {
  const { description } = req.body;
  if (!description) return res.status(400).json({ error: 'Missing description' });
  const result = addEvent(description);
  res.json(result);
});

// Relationship log endpoint
app.post('/log/relationship', (req, res) => {
  const { characterA, characterB, status } = req.body;
  if (!characterA || !characterB || !status) {
    return res.status(400).json({ error: 'Missing characters or status' });
  }
  const result = updateRelationship(characterA, characterB, status);
  res.json(result);
});

// Location log endpoint
app.post('/log/location', (req, res) => {
  const { character, location, sceneTag } = req.body;
  if (!character || !location) return res.status(400).json({ error: 'Missing character or location' });
  const result = updateLocation(character, location, sceneTag);
  res.json(result);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Marvel Nexus API is running on port ${PORT}`);
});

app.use((req, res) => {
  res.status(404).json({ error: "Endpoint not found" });
});
