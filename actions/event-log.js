const fs = require('fs');
const path = require('path');

const logPath = path.join(__dirname, '../data/example-log.json');

function loadLog() {
  if (!fs.existsSync(logPath)) {
    fs.writeFileSync(logPath, JSON.stringify({ events: [] }, null, 2));
  }
  return JSON.parse(fs.readFileSync(logPath));
}

function saveLog(log) {
  fs.writeFileSync(logPath, JSON.stringify(log, null, 2));
}

function addEvent(description) {
  const log = loadLog();

  const event = {
    id: `Event ${log.events.length + 1}`,
    description,
    timestamp: new Date().toISOString()
  };

  log.events.push(event);
  saveLog(log);

  return event;
}

function getEvents() {
  const log = loadLog();
  return log.events || [];
}

module.exports = { addEvent, getEvents };
