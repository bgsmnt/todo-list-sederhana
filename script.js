document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('todo-form');
    const input = document.getElementById('todo-input');
    const dateInput = document.getElementById('todo-date');
    const todoList = document.getElementById('todo-list');
    const sortSelect = document.getElementById('sort-select');

    let todos = JSON.parse(localStorage.getItem('todos')) || [];

    renderTodos();

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        addTodo();
    });

    sortSelect.addEventListener('change', renderTodos);

    function addTodo() {
        if (input.value.trim() === '') return;

        const todo = {
            id: Date.now(),
            text: input.value,
            completed: false,
            date: dateInput.value || null,
            dateAdded: new Date().toISOString()
        };

        todos.push(todo);
        saveTodos();
        renderTodos();
        input.value = '';
        dateInput.value = '';
    }

    function renderTodos() {
        todoList.innerHTML = '';
        sortTodos();
        todos.forEach(todo => {
            const li = document.createElement('li');
            li.innerHTML = `
                <div class="todo-item ${todo.completed ? 'completed' : ''}">
                    <input type="checkbox" ${todo.completed ? 'checked' : ''}>
                    <span class="todo-text">${todo.text}</span>
                    ${todo.date ? `<span class="todo-date">Jatuh tempo: ${todo.date}</span>` : ''}
                </div>
                <button class="edit-btn">Edit</button>
                <button class="delete-btn">Hapus</button>
            `;

            const checkbox = li.querySelector('input[type="checkbox"]');
            checkbox.addEventListener('change', () => {
                todo.completed = checkbox.checked;
                li.querySelector('.todo-item').classList.toggle('completed', todo.completed);
                saveTodos();
            });

            const editBtn = li.querySelector('.edit-btn');
            editBtn.addEventListener('click', () => {
                editTodo(todo, li);
            });

            const deleteBtn = li.querySelector('.delete-btn');
            deleteBtn.addEventListener('click', () => {
                if (confirm('Apakah Anda yakin ingin menghapus tugas ini?')) {
                    todos = todos.filter(t => t.id !== todo.id);
                    saveTodos();
                    renderTodos();
                }
            });

            todoList.appendChild(li);
        });
    }

    function editTodo(todo, li) {
        const todoText = li.querySelector('.todo-text');
        const editInput = document.createElement('input');
        editInput.type = 'text';
        editInput.value = todo.text;
        todoText.replaceWith(editInput);

        const editDate = document.createElement('input');
        editDate.type = 'date';
        editDate.value = todo.date || '';
        li.querySelector('.todo-date')?.replaceWith(editDate);

        const saveBtn = document.createElement('button');
        saveBtn.textContent = 'Simpan';
        saveBtn.addEventListener('click', () => {
            todo.text = editInput.value;
            todo.date = editDate.value || null;
            saveTodos();
            renderTodos();
        });

        li.querySelector('.edit-btn').replaceWith(saveBtn);
    }

    function sortTodos() {
        const sortBy = sortSelect.value;
        todos.sort((a, b) => {
            switch (sortBy) {
                case 'date-added':
                    return new Date(b.dateAdded) - new Date(a.dateAdded);
                case 'due-date':
                    if (!a.date) return 1;
                    if (!b.date) return -1;
                    return new Date(a.date) - new Date(b.date);
                case 'alphabetical':
                    return a.text.localeCompare(b.text);
                default:
                    return 0;
            }
        });
    }

    function saveTodos() {
        localStorage.setItem('todos', JSON.stringify(todos));
    }
});