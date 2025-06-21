import express from 'express'
import { registrarProgreso,listarProgreso,actualizarProgreso,eliminarProgreso} from '../controller/controller.progreso';
const router = express.Router()
// ruta para el crud de la tabla progreso
router.post('/registrar', registrarProgreso);
router.get('/listar', listarProgreso);
router.put('/actualizar', actualizarProgreso);
router.delete('/eliminar/:id_progreso', eliminarProgreso);
export default router