import express from 'express'
import { listarRutina,registrarRutina,actualizarRutina,eliminarRutina } from '../controller/controller.rutina';
const router = express.Router()
// ruta para el crud de la tabla rutina
router.post('/registrar', registrarRutina);
router.get('/listar', listarRutina);
router.put('/actualizar', actualizarRutina);
router.delete('/eliminar/:id_rutina', eliminarRutina);
export default router
