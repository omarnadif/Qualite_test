// @ts-check
const { test, expect, request } = require('@playwright/test');

test.describe('API Tasks', () => {

    test('POST /tasks devrait créer une tâche', async ({ request }) => {
        const response = await request.post('http://localhost:3000/tasks', {
            data: {
                title: 'Test E2E',
                completed: false
            }
        });

        const body = await response.json();

        expect(response.status()).toBe(201);
        expect(body).toEqual({
            id: 1,
            title: 'Test E2E',
            completed: false
        });
    });

});
