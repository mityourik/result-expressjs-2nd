const http = require('http');
const port = 3000;
const fs = require('fs/promises');
const path = require('path');
const { addNote } = require('./notes.controller.js');

const rootPath = path.join(__dirname, 'pages');

const server = http.createServer(async (req, res) => {
    if (req.method === 'GET') {
        const content = await fs.readFile(path.join(rootPath, 'index.html'), 'utf-8');
        res.writeHead(200, {
            'Content-Type': 'text/html; charset=utf-8'
        });
        return res.end(content);
    } else if (req.method === 'POST') {
        const body = [];
        res.writeHead(200, {
            'Content-Type': 'text/html; charset=utf-8'
        });
        
        req.on('data', data => {
            body.push(Buffer.from(data))
        })
        req.on('end', () => {
            const title = body.toString().split('=')[1].replaceAll('+', ' ');
            addNote(title);
            res.end(`Title: ${title}`);
        })
    }
});

server.listen(port, () => console.log(`Server is running on port ${port}`));