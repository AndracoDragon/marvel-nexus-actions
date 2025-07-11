const { google } = require('googleapis');
const credentials = require('../credentials.json');

const auth = new google.auth.GoogleAuth({
  credentials: credentials,
  scopes: ['https://www.googleapis.com/auth/drive']
});

const drive = google.drive({ version: 'v3', auth });

module.exports = drive;