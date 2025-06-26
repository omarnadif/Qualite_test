const taskForm = document.getElementById('taskForm');
const titleInput = document.getElementById('titleInput');
const taskList = document.getElementById('taskList');

const API_URL = 'http://localhost:3000/tasks';

// Sauvegarder les tâches dans le navigateur
function saveTasksToStorage(tasks) {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Charger les tâches depuis le navigateur
function loadTasksFromStorage() {
    const saved = localStorage.getItem('tasks');
    return saved ? JSON.parse(saved) : [];
}

// Afficher les tâches dans la liste
function renderTasks(tasks) {
    taskList.innerHTML = '';
    tasks.forEach(task => {
        const li = document.createElement('li');
        li.className = 'bg-white shadow flex justify-between items-center px-4 py-3 rounded-2xl border border-blue-100';

        // Checkbox icon
        const checkBtn = document.createElement('button');
        checkBtn.innerHTML = task.completed
            ? `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <circle cx="12" cy="12" r="11" fill="#dcfce7"/>
          <path stroke="#16a34a" stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M7 13l3 3 6-6" />
        </svg>`
            : `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <circle cx="12" cy="12" r="11" fill="#f3f4f6"/>
        </svg>`;
        checkBtn.className = "mr-3 focus:outline-none";
        checkBtn.title = task.completed ? "Marquer comme non terminé" : "Marquer comme terminé";
        checkBtn.onclick = () => updateTask(task.id, {completed: !task.completed});

        // Task title (strikethrough if completed)
        const text = document.createElement('span');
        text.textContent = task.title;
        text.className = 'text-lg flex-1' + (task.completed ? ' line-through text-gray-400' : '');

        // Edit button (matita)
        const editBtn = document.createElement('button');
        editBtn.innerHTML = `
  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-yellow-500 hover:text-yellow-700 transition" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16.862 3.487a2.25 2.25 0 113.182 3.182L7.974 18.739a4.5 4.5 0 01-1.712 1.062l-3.003.857a.375.375 0 01-.462-.462l.857-3.003a4.5 4.5 0 011.062-1.712l12.07-12.07z" />
  </svg>
`;


        editBtn.title = "Modifier";
        editBtn.className = "ml-4 p-2 bg-yellow-100 rounded-full hover:bg-yellow-200 focus:outline-none";
        editBtn.onclick = () => editTaskPrompt(task);

        // Delete button
        const deleteBtn = document.createElement('button');
        deleteBtn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-red-500 hover:text-red-700 transition" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
      </svg>
    `;
        deleteBtn.title = "Supprimer";
        deleteBtn.className = "ml-2 p-2 bg-red-100 rounded-full hover:bg-red-200 focus:outline-none";
        deleteBtn.onclick = () => deleteTask(task.id);

        li.append(checkBtn, text, editBtn, deleteBtn);
        taskList.appendChild(li);
    });
}

//Update
function editTaskPrompt(task) {
    const nouveauTitre = prompt("Modifier le titre de la tâche :", task.title);
    if (nouveauTitre !== null && nouveauTitre.trim() !== "" && nouveauTitre !== task.title) {
        updateTask(task.id, {title: nouveauTitre});
    }
}

// Ajouter une nouvelle tâche
taskForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const newTask = {title: titleInput.value, completed: false};
    await fetch(API_URL, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(newTask)
    });
    titleInput.value = '';
    fetchTasks();
});

// Modifier une tâche existante
async function updateTask(id, data) {
    await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    });
    fetchTasks();
}

// Supprimer une tâche
async function deleteTask(id) {
    await fetch(`${API_URL}/${id}`, {method: 'DELETE'});
    fetchTasks();
}

// Charger les tâches stockées localement en premier
renderTasks(loadTasksFromStorage());

// Puis les mettre à jour depuis le serveur
async function fetchTasks() {
    const res = await fetch(API_URL);
    const tasks = await res.json();
    renderTasks(tasks);
    saveTasksToStorage(tasks);
}

fetchTasks();
