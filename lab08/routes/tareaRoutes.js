const express = require('express');
const router = express.Router();
const tareaController = require('../controllers/tareaController');
const authMiddleware = require('../middleware/authMiddleware');

// Usamos el middleware para que solo gente con sesión pueda ver/crear tareas
router.use(authMiddleware.requireAuth);

router.get('/', tareaController.getTareas);
router.post('/', tareaController.createTarea);
router.put('/:id', tareaController.updateTarea);
router.delete('/:id', tareaController.deleteTarea);

module.exports = router;
