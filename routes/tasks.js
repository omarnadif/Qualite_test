const express = require('express');
const router = express.Router();
const tasksController = require('../controllers/tasksController');

// GETALL
router.get('/', tasksController.getAllTasks);

// POST NEW
router.post('/', tasksController.createTask);

// PUT UPDATE
router.put('/:id', tasksController.updateTask);

// DELETE BY ID
router.delete('/:id', tasksController.deleteTask);

module.exports = router;
