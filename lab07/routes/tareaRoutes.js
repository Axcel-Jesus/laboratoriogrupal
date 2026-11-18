const express = require('express');
const router = express.Router();
const tareaController = require('../controllers/tareaController');
const authMiddleware = require('../middleware/authMiddleware');

// Protegemos todas las rutas de tareas
router.use(authMiddleware.requireAuth);

router.get('/', tareaController.getTareas);
router.post('/', tareaController.createTarea);
router.put('/:id', tareaController.updateTarea);
router.delete('/:id', tareaController.deleteTarea);

module.exports = router;
