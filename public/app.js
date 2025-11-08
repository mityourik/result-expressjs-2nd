document.addEventListener('click', (event) => {
    const button = event.target.closest('button[data-action][data-id]');
    if (!button) {
        return;
    }

    const { action, id } = button.dataset;
    if (!id || !action) {
        return;
    }

    if (action === 'delete') {
        removeNote(id);
    } else if (action === 'edit') {
        editNote(id);
    }
});

async function removeNote(id) {
    try {
        const response = await fetch(`/${id}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new Error('Failed to delete note');
        }

        const data = await response.json();

        if (data.success) {
            const noteItem = document.querySelector(`[data-note-id="${id}"]`);
            noteItem?.remove();
        } else {
            throw new Error('Failed to delete note');
        }
    } catch (error) {
        alert(error.message);
    }
}

async function editNote(id) {
    const noteItem = document.querySelector(`[data-note-id="${id}"]`);
    const titleElement = noteItem?.querySelector('[data-note-title]');

    if (!titleElement) {
        return;
    }

    const currentTitle = titleElement.textContent.trim();
    const newTitle = prompt('Введите новое название заметки', currentTitle);

    if (newTitle === null) {
        // user cancelled the prompt
        return;
    }

    const trimmedTitle = newTitle.trim();

    if (!trimmedTitle) {
        alert('Название не может быть пустым.');
        return;
    }

    try {
        const response = await fetch(`/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ title: trimmedTitle }),
        });

        if (!response.ok) {
            throw new Error('Не удалось обновить заметку');
        }

        const data = await response.json();

        if (data.success && data.note?.title) {
            titleElement.textContent = data.note.title;
        } else {
            throw new Error('Не удалось обновить заметку');
        }
    } catch (error) {
        alert(error.message);
    }
}