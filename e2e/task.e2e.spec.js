// @ts-check
const { test, expect, request } = require('@playwright/test');

test.describe('API Tasks', () => {
    const apiURL = 'http://localhost:3000';

    test('POST /tasks devrait créer une tâche', async () => {
        const context = await request.newContext();
        const newTask = { title: 'Test Playwright', completed: false };

        const response = await context.post(`${apiURL}/tasks`, {
            data: newTask
        });
        const body = await response.json();

        expect(response.status()).toBe(201);
        expect(body).toMatchObject(newTask);
        expect(body).toHaveProperty('id');
    });

    test('GET /tasks doit retourner la liste des tâches', async () => {
        const context = await request.newContext();
        const response = await context.get(`${apiURL}/tasks`);
        expect(response.status()).toBe(200);
        const body = await response.json();
        expect(Array.isArray(body)).toBe(true);
    });

    test('PUT /tasks/:id doit modifier une tâche', async () => {
        const context = await request.newContext();

        // Créer une tâche à modifier
        const newTask = { title: 'À modifier', completed: false };
        const createRes = await context.post(`${apiURL}/tasks`, { data: newTask });
        const task = await createRes.json();

        // Modifier la tâche
        const updateData = { title: 'Modifiée', completed: true };
        const updateRes = await context.put(`${apiURL}/tasks/${task.id}`, { data: updateData });
        const updatedTask = await updateRes.json();

        expect(updateRes.status()).toBe(200);
        expect(updatedTask).toMatchObject({ ...updateData, id: task.id });
    });

    test('DELETE /tasks/:id doit supprimer une tâche', async () => {
        const context = await request.newContext();

        // Créer une tâche à supprimer
        const newTask = { title: 'À supprimer', completed: false };
        const createRes = await context.post(`${apiURL}/tasks`, { data: newTask });
        const task = await createRes.json();

        // Supprimer la tâche
        const deleteRes = await context.delete(`${apiURL}/tasks/${task.id}`);
        const deleteBody = await deleteRes.json();

        expect(deleteRes.status()).toBe(200);
        expect(deleteBody.message).toMatch(/supprimée/i);
    });

    test('POST /tasks sans titre doit échouer', async () => {
        const context = await request.newContext();
        const response = await context.post(`${apiURL}/tasks`, {
            data: { completed: false }
        });
        expect(response.status()).toBe(400);
        const body = await response.json();
        expect(body.error).toBeDefined();
    });

    test('PUT /tasks/:id inexistant doit renvoyer 404', async () => {
        const context = await request.newContext();
        const response = await context.put(`${apiURL}/tasks/99999`, {
            data: { title: 'Test inexistant', completed: false }
        });
        expect(response.status()).toBe(404);
        const body = await response.json();
        expect(body.error).toBeDefined();
    });

    test('DELETE /tasks/:id inexistant doit renvoyer 404', async () => {
        const context = await request.newContext();
        const response = await context.delete(`${apiURL}/tasks/99999`);
        expect(response.status()).toBe(404);
        const body = await response.json();
        expect(body.error).toBeDefined();
    });

});
