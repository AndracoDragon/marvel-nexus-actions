const fs = require('fs');
const path = require('path');

// Path to the JSON log file
const logPath = path.join(__dirname, '../data/example-log.json');

// Ensure log file exists
function loadLog() {
  if (!fs.existsSync(logPath)) {
    fs.writeFileSync(logPath, JSON.stringify({ bookmarks: [] }, null, 2));
  }
  return JSON.parse(fs.readFileSync(logPath));
}

function saveLog(log) {
  fs.writeFileSync(logPath, JSON.stringify(log, null, 2));
}

/**
 * Adds a new bookmark entry to the log
 * @param {string} title - Short title of the event (1–5 words)
 * @param {string} summary - One-sentence summary of what happened
 * @returns {object} - The created bookmark object
 */
function createBookmark(title, summary) {
  const log = loadLog();

  const newBookmark = {
    id: `Bookmark ${log.bookmarks.length + 1}`,
    title,
    summary,
    timestamp: new Date().toISOString()
  };

  log.bookmarks.push(newBookmark);
  saveLog(log);

  return newBookmark;
}
function getBookmarks() {
  const log = loadLog();
  return log.bookmarks || [];
}

// Export function
module.exports = {
  createBookmark,
  getBookmarks
};

