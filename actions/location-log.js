const fs = require('fs');
const path = require('path');

const logPath = path.join(__dirname, '../data/example-log.json');

function loadLog() {
  if (!fs.existsSync(logPath)) {
    fs.writeFileSync(logPath, JSON.stringify({ locations: [] }, null, 2));
  }
  return JSON.parse(fs.readFileSync(logPath));
}

function saveLog(log) {
  fs.writeFileSync(logPath, JSON.stringify(log, null, 2));
}

/**
 * Updates or adds a character's current location and optional scene tag.
 * @param {string} character
 * @param {string} location
 * @param {string|null} sceneTag
 */
function updateLocation(character, location, sceneTag = null) {
  const log = loadLog();
  const existing = log.locations.find(loc => loc.character === character);

  const entry = {
    character,
    location,
    sceneTag,
    updated: new Date().toISOString()
  };

  if (existing) {
    Object.assign(existing, entry);
  } else {
    log.locations.push(entry);
  }

  saveLog(log);
  return entry;
}

function getLocations() {
  const log = loadLog();
  return log.locations || [];
}

module.exports = { updateLocation, getLocations };
