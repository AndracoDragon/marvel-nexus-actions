const fs = require('fs');
const path = require('path');

const logPath = path.join(__dirname, '../data/example-log.json');

function loadLog() {
  return JSON.parse(fs.readFileSync(logPath));
}

function saveLog(log) {
  fs.writeFileSync(logPath, JSON.stringify(log, null, 2));
}

function daysOld(dateStr) {
  const then = new Date(dateStr);
  const now = new Date();
  return Math.floor((now - then) / (1000 * 60 * 60 * 24));
}

function pruneLog({ keepRecentBookmarks = 5, maxEventAgeDays = 90, maxLocationAgeDays = 60 } = {}) {
  const log = loadLog();

  // 1. Prune bookmarks (keep last X)
  if (log.bookmarks.length > keepRecentBookmarks) {
    log.bookmarks = log.bookmarks.slice(-keepRecentBookmarks);
  }

  // 2. Prune old events
  log.events = log.events.filter(event => {
    return !event.timestamp || daysOld(event.timestamp) <= maxEventAgeDays;
  });

  // 3. Prune old locations
  log.locations = log.locations.filter(loc => {
    return !loc.updated || daysOld(loc.updated) <= maxLocationAgeDays;
  });

  // 4. Prune outdated relationships (no update in 6 months)
  log.relationships = log.relationships.filter(rel => {
    return !rel.updated || daysOld(rel.updated) <= 180;
  });

  saveLog(log);
  return {
    message: 'Log pruned successfully.',
    retained: {
      bookmarks: log.bookmarks.length,
      events: log.events.length,
      relationships: log.relationships.length,
      locations: log.locations.length
    }
  };
}

module.exports = { pruneLog };
