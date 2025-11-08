const fs = require('fs/promises');
const path = require('path');

const dbPath = path.join(__dirname, 'db.json');
    
async function loadNotes() {
    try {
        const data = await fs.readFile(dbPath, 'utf-8');
        return data.trim() ? JSON.parse(data) : [];
    } catch (error) {
        if (error.code === 'ENOENT') {
            return [];
        }
        throw error;
    }
}

async function addNote(title) {
    const notes = await loadNotes();
    const newNote = {
        title,
        id: Date.now().toString()
    }
    notes.push(newNote);

    await fs.writeFile(dbPath, JSON.stringify(notes, null, 2));
}

async function getNotes() {
    const notes = await loadNotes();
    return notes;
}

async function removeNote(id) {
    const notes = await loadNotes();
    const filteredNotes = notes.filter(note => note.id !== id);
    await fs.writeFile(dbPath, JSON.stringify(filteredNotes, null, 2));
}

async function updateNote(id, title) {
    const trimmedTitle = title?.trim();

    if (!trimmedTitle) {
        return null;
    }

    const notes = await loadNotes();
    const index = notes.findIndex(note => note.id === id);

    if (index === -1) {
        return null;
    }

    const updatedNote = { ...notes[index], title: trimmedTitle };
    notes[index] = updatedNote;

    await fs.writeFile(dbPath, JSON.stringify(notes, null, 2));

    return updatedNote;
}

module.exports = {
    addNote,
    getNotes,
    removeNote,
    updateNote
}