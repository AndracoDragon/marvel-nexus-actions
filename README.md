# Marvel Nexus Actions (Cloud Run & Google Drive)

## Setup
1. Place your Google Drive API `credentials.json` in the project root (not included for security).
2. Deploy this project to Google Cloud Run, or run locally with `npm install && node index.js`.

## Endpoints
- `GET /` - Health check
- `POST /log-event` - Create or update a Google Doc. Body:
  {
    "fileName": "MajorPlot.docx",
    "content": "This is a test event."
  }