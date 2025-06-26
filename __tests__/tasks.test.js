jest.mock('../data/tasks', () => []);
const tasks = require('../data/tasks');
const { createTask } = require('../controllers/tasksController');

// Fonction utilitaire pour simuler les objets req et res
const createMockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn();
    return res;
};


// Tests pour la creation de tâches
describe('createTask', () => {

    beforeEach(() => {
        // Nettoyer les données avant chaque test
        tasks.length = 0;
    });

    test('devrait créer une tâche avec titre valide', () => {
        const req = {
            body: {
                title: 'Faire les courses',
                completed: false
            }
        };
        const res = createMockResponse();

        createTask(req, res);

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({
            id: 1,
            title: 'Faire les courses',
            completed: false
        });
        expect(tasks.length).toBe(1);
    });

    test('devrait retourner une erreur si le titre est manquant', () => {
        const req = {
            body: {}
        };
        const res = createMockResponse();

        createTask(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            error: 'Le champ "title" est obligatoire.'
        });
    });

});



// Tests pour la mise à jour de tâches
const { updateTask } = require('../controllers/tasksController');

describe('updateTask', () => {

    beforeEach(() => {
        // Réinitialiser les tâches avant chaque test
        tasks.length = 0;
        tasks.push({
            id: 1,
            title: 'Tâche initiale',
            completed: false
        });
    });

    test('devrait mettre à jour le titre et le statut', () => {
        const req = {
            params: { id: '1' },
            body: { title: 'Tâche modifiée', completed: true }
        };
        const res = createMockResponse();

        updateTask(req, res);

        expect(res.json).toHaveBeenCalledWith({
            id: 1,
            title: 'Tâche modifiée',
            completed: true
        });
    });

    test('devrait retourner une erreur si la tâche est introuvable', () => {
        const req = {
            params: { id: '999' },
            body: { title: 'Nouvelle valeur' }
        };
        const res = createMockResponse();

        updateTask(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ error: 'Tâche non trouvée.' });
    });

});


// Tests pour la suppression de tâches
const { deleteTask } = require('../controllers/tasksController');

describe('deleteTask', () => {

    beforeEach(() => {
        tasks.length = 0;
        tasks.push({
            id: 1,
            title: 'Tâche à supprimer',
            completed: false
        });
    });

    test('devrait supprimer une tâche existante', () => {
        const req = {
            params: { id: '1' }
        };
        const res = createMockResponse();

        deleteTask(req, res);

        expect(res.json).toHaveBeenCalledWith({ message: 'Tâche supprimée avec succès.' });
        expect(tasks.length).toBe(0);
    });

    test('devrait retourner une erreur si la tâche est introuvable', () => {
        const req = {
            params: { id: '999' }
        };
        const res = createMockResponse();

        deleteTask(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ error: 'Tâche non trouvée.' });
    });

});


// Tests pour la récupération de toutes les tâches
const { getAllTasks } = require('../controllers/tasksController');

describe('getAllTasks', () => {

    beforeEach(() => {
        tasks.length = 0;
        tasks.push(
            { id: 1, title: 'Tâche 1', completed: false },
            { id: 2, title: 'Tâche 2', completed: true }
        );
    });

    test('devrait retourner toutes les tâches', () => {
        const req = {};
        const res = createMockResponse();

        getAllTasks(req, res);

        expect(res.json).toHaveBeenCalledWith([
            { id: 1, title: 'Tâche 1', completed: false },
            { id: 2, title: 'Tâche 2', completed: true }
        ]);
    });

});


