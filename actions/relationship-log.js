const fs = require('fs');
const path = require('path');

const logPath = path.join(__dirname, '../data/example-log.json');

function loadLog() {
  if (!fs.existsSync(logPath)) {
    fs.writeFileSync(logPath, JSON.stringify({ relationships: [] }, null, 2));
  }
  return JSON.parse(fs.readFileSync(logPath));
}

function saveLog(log) {
  fs.writeFileSync(logPath, JSON.stringify(log, null, 2));
}

/**
 * Adds or updates a relationship between two characters
 * @param {string} characterA
 * @param {string} characterB
 * @param {string} status - Current relationship status
 */
function updateRelationship(characterA, characterB, status) {
  const log = loadLog();
  const key = `${characterA} & ${characterB}`;
  const existing = log.relationships.find(rel => rel.key === key || rel.key === `${characterB} & ${characterA}`);

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

function getRelationships() {
  const log = loadLog();
  return log.relationships || [];
}

module.exports = { updateRelationship, getRelationships };
