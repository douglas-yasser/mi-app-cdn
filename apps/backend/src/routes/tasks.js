const express = require('express');
const router = express.Router();
const db = require('../db');

/**
 * @swagger
 * /api/tasks:
 *   get:
 *     summary: Obtiene todas las tareas
 *     responses:
 *       200:
 *         description: Lista de tareas
 */
router.get('/', async (req, res) => {
  try {
    const tasks = await db('tasks').select('*').orderBy('created_at', 'desc');
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /api/tasks:
 *   post:
 *     summary: Crea una nueva tarea
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *     responses:
 *       201:
 *         description: Tarea creada
 */
router.post('/', async (req, res) => {
  try {
    const [task] = await db('tasks').insert({ title: req.body.title }).returning('*');
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /api/tasks/{id}:
 *   patch:
 *     summary: Actualiza el estado de una tarea
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
 *               completed:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Tarea actualizada
 */
router.patch('/:id', async (req, res) => {
  try {
    const [task] = await db('tasks')
      .where({ id: req.params.id })
      .update({ completed: req.body.completed })
      .returning('*');
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /api/tasks/{id}:
 *   delete:
 *     summary: Elimina una tarea
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Tarea eliminada
 */
router.delete('/:id', async (req, res) => {
  try {
    await db('tasks').where({ id: req.params.id }).delete();
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;