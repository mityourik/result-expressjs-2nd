const express = require('express');
const port = 3000;
const { addNote, getNotes, removeNote, updateNote } = require('./notes.controller.js');
const path = require('path');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'pages');

app.use(express.static(path.resolve(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', async (req, res) => {
    res.render('index', {
        title: 'Express App',
        notes: await getNotes(),
        created: false,
    });
})

app.post('/', async (req, res) => {
    await addNote(req.body.title);
    res.render('index', {
        title: 'Express App',
        notes: await getNotes(),
        created: true,
    });
});

app.delete('/:id', async (req, res) => {
    console.log(req.params.id);
    await removeNote(req.params.id);
    res.json({ success: true });
});

app.put('/:id', async (req, res) => {
    try {
        const note = await updateNote(req.params.id, req.body.title);

        if (!note) {
            return res.status(400).json({ success: false, message: 'Unable to update note' });
        }

        res.json({ success: true, note });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});

app.listen(port, () => console.log(`Server is running on port ${port}`));