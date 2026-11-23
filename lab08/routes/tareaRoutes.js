const express = require('express');
const router = express.Router();
const tareaController = require('../controllers/tareaController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware.requireAuth);

router.get('/', tareaController.getTareas);
router.post('/', tareaController.createTarea);
router.put('/:id', tareaController.updateTarea);
router.delete('/:id', tareaController.deleteTarea);

// NUEVA RUTA PARA EL DASHBOARD
router.get('/estadisticas', tareaController.getEstadisticas);

module.exports = router;
