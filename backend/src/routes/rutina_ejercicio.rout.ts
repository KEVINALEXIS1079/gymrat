import express from 'express'
import { listarRutinaEjercicio,registrarRutinaEjercicio,actualizarRutinaEjercicio,eliminarRutinaEjercicio } from '../controller/controller.rutina_ejercicio';
const router = express.Router()
// ruta para el crud de la tabla rutina_ejercicio
router.post('/registrar', registrarRutinaEjercicio);
router.get('/listar', listarRutinaEjercicio);
router.put('/actualizar', actualizarRutinaEjercicio);
router.delete('/eliminar/:id_rutina_ejercicio', eliminarRutinaEjercicio);
export default router