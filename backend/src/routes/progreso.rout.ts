import express from 'express'
import { registrarProgreso,listarProgreso,actualizarProgreso,eliminarProgreso,cargarimg,obtenerProgresoPorId} from '../controller/controller.progreso';
const router = express.Router()
// ruta para el crud de la tabla progreso
router.post('/registrar', cargarimg,registrarProgreso);
router.get('/listar', listarProgreso);
router.put('/actualizar', cargarimg, actualizarProgreso);
router.delete('/eliminar/:id_progreso', eliminarProgreso);
router.get('/obtener/:id_progreso', obtenerProgresoPorId);
export default router;