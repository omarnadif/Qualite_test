const tasks = require('../data/tasks');

// Récupérer toutes les tâches
exports.getAllTasks = (req, res) => {
    res.json(tasks);
};

// Créer une nouvelle tâche
exports.createTask = (req, res) => {
    const { title, completed } = req.body;

    if (!title) {
        return res.status(400).json({ error: 'Le champ "title" est obligatoire.' });
    }

    const newTask = {
        id: tasks.length + 1,
        title,
        completed: completed || false,
    };

    tasks.push(newTask);
    res.status(201).json(newTask);
};

// Mettre à jour une tâche existante
exports.updateTask = (req, res) => {
    const taskId = parseInt(req.params.id);
    const { title, completed } = req.body;
    const task = tasks.find(t => t.id === taskId);

    if (!task) {
        return res.status(404).json({ error: 'Tâche non trouvée.' });
    }

    task.title = title !== undefined ? title : task.title;
    task.completed = completed !== undefined ? completed : task.completed;

    res.json(task);
};

// Supprimer une tâche
exports.deleteTask = (req, res) => {
    const taskId = parseInt(req.params.id);
    const index = tasks.findIndex(t => t.id === taskId);

    if (index === -1) {
        return res.status(404).json({ error: 'Tâche non trouvée.' });
    }

    tasks.splice(index, 1);
    res.json({ message: 'Tâche supprimée avec succès.' });
};
