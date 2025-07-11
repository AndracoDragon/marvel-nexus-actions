const express = require('express');
const { google } = require('googleapis');
const credentials = require('./credentials.json');

const auth = new google.auth.GoogleAuth({
  credentials: credentials,
  scopes: ['https://www.googleapis.com/auth/drive']
});

const drive = google.drive({ version: 'v3', auth });

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
    res.status(200).send('Marvel Nexus Actions is live!');
});

app.post('/log-event', async (req, res) => {
    const { fileName, content } = req.body;

    try {
        // Search for an existing Google Doc
        const files = await drive.files.list({
            q: `name='${fileName}' and mimeType='application/vnd.google-apps.document'`,
            spaces: 'drive'
        });

        let fileId;
        if (files.data.files.length === 0) {
            // File doesn't exist; create it
            const fileMetadata = {
                name: fileName,
                mimeType: 'application/vnd.google-apps.document'
            };
            const file = await drive.files.create({
                resource: fileMetadata,
                fields: 'id'
            });
            fileId = file.data.id;
        } else {
            fileId = files.data.files[0].id;
        }

        // Use Google Docs API to update content
        const docs = google.docs({ version: 'v1', auth });
        await docs.documents.batchUpdate({
            documentId: fileId,
            requestBody: {
                requests: [
                    { deleteContentRange: { range: { startIndex: 1, endIndex: 1000000 } } },
                    { insertText: { location: { index: 1 }, text: content } }
                ]
            }
        });

        res.status(200).send(`Successfully logged event to ${fileName}.`);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error logging event.');
    }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});