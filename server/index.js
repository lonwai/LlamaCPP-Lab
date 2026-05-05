import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;
const DATA_DIR = path.join(__dirname, '../data');

app.use(cors());
app.use(express.json());

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initialize JSON files if they don't exist
const conversationsFile = path.join(DATA_DIR, 'conversations.json');
const settingsFile = path.join(DATA_DIR, 'settings.json');
const benchmarksFile = path.join(DATA_DIR, 'benchmarks.json');

if (!fs.existsSync(conversationsFile)) {
  fs.writeFileSync(conversationsFile, JSON.stringify([], null, 2));
}

if (!fs.existsSync(settingsFile)) {
  fs.writeFileSync(settingsFile, JSON.stringify({
    temperature: 0.7,
    max_tokens: 2048,
    top_p: 0.9,
    stop: [],
  }, null, 2));
}

if (!fs.existsSync(benchmarksFile)) {
  fs.writeFileSync(benchmarksFile, JSON.stringify([], null, 2));
}

// Read conversations
app.get('/api/conversations', (req, res) => {
  try {
    const data = fs.readFileSync(conversationsFile, 'utf-8');
    res.json(JSON.parse(data));
  } catch (error) {
    res.status(500).json({ error: 'Failed to read conversations' });
  }
});

// Save conversations
app.post('/api/conversations', (req, res) => {
  try {
    fs.writeFileSync(conversationsFile, JSON.stringify(req.body, null, 2));
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save conversations' });
  }
});

// Read settings
app.get('/api/settings', (req, res) => {
  try {
    const data = fs.readFileSync(settingsFile, 'utf-8');
    res.json(JSON.parse(data));
  } catch (error) {
    res.status(500).json({ error: 'Failed to read settings' });
  }
});

// Save settings
app.post('/api/settings', (req, res) => {
  try {
    fs.writeFileSync(settingsFile, JSON.stringify(req.body, null, 2));
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save settings' });
  }
});

// Read benchmarks
app.get('/api/benchmarks', (req, res) => {
  try {
    const data = fs.readFileSync(benchmarksFile, 'utf-8');
    res.json(JSON.parse(data));
  } catch (error) {
    res.status(500).json({ error: 'Failed to read benchmarks' });
  }
});

// Save benchmark
app.post('/api/benchmarks', (req, res) => {
  try {
    const benchmarks = JSON.parse(fs.readFileSync(benchmarksFile, 'utf-8'));
    benchmarks.push({ ...req.body, timestamp: Date.now() });
    fs.writeFileSync(benchmarksFile, JSON.stringify(benchmarks, null, 2));
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save benchmark' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Data directory: ${DATA_DIR}`);
});
