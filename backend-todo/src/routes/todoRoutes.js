const express = require('express');
const router = express.Router();
const TodoController = require('../controllers/todoController');
const authMiddleware = require('../middleware/authMiddleware');
const { validateCreateTodo, validateUpdateTodo } = require('../middleware/validateMiddleware');

// All todo routes require authentication
router.use(authMiddleware);

// CRUD routes
router.post('/', validateCreateTodo, TodoController.createTodo);
router.get('/', TodoController.getTodos);
router.get('/:id', TodoController.getTodoById);
router.put('/:id', validateUpdateTodo, TodoController.updateTodo);
router.delete('/:id', TodoController.deleteTodo);

module.exports = router;
