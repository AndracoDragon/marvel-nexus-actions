const fs = require('fs');
const path = require('path');

const logPath = path.join(__dirname, '../data/example-log.json');

function loadLog() {
  if (!fs.existsSync(logPath)) {
    fs.writeFileSync(logPath, JSON.stringify({
      bookmarks: [],
      events: [],
      relationships: [],
      locations: []
    }, null, 2));
  }
  return JSON.parse(fs.readFileSync(logPath));
}

function saveLog(log) {
  fs.writeFileSync(logPath, JSON.stringify(log, null, 2));
}

function addEvent(description) {
  const log = loadLog();
  log.events.push({
    id: `Event ${log.events.length + 1}`,
    description,
    timestamp: new Date().toISOString()
  });
  saveLog(log);
  return log.events[log.events.length - 1];
}

function updateRelationship(characterA, characterB, status) {
  const log = loadLog();
  const key = `${characterA} & ${characterB}`;
  const existing = log.relationships.find(rel => rel.key === key);

  const entry = {
    key,
    characterA,
    characterB,
    status,
    updated: new Date().toISOString()
  };

  if (existing) {
    Object.assign(existing, entry);
  } else {
    log.relationships.push(entry);
  }

  saveLog(log);
  return entry;
}

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

module.exports = {
  addEvent,
  updateRelationship,
  updateLocation
};
