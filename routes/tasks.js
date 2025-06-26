const express = require('express');
const router = express.Router();
const tasksController = require('../controllers/tasksController');

/**
 * @swagger
 * /tasks:
 *   get:
 *     summary: Récupérer toutes les tâches
 *     responses:
 *       200:
 *         description: Liste des tâches
 */
router.get('/', tasksController.getAllTasks);

/**
 * @swagger
 * /tasks:
 *   post:
 *     summary: Créer une nouvelle tâche
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               completed:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Tâche créée
 */
router.post('/', tasksController.createTask);

/**
 * @swagger
 * /tasks/{id}:
 *   put:
 *     summary: Mettre à jour une tâche existante
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               completed:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Tâche mise à jour
 */
router.put('/:id', tasksController.updateTask);

/**
 * @swagger
 * /tasks/{id}:
 *   delete:
 *     summary: Supprimer une tâche
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Tâche supprimée avec succès
 */
router.delete('/:id', tasksController.deleteTask);


module.exports = router;
