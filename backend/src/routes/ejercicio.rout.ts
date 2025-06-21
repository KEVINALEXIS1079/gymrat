import express from 'express'
import { listarEjercicio, registrarEjercicio, actualizarEjercicio, eliminarEjercicio,listarEjerciciosPorZonaMuscular,buscarEjercicioPorNombre,cargarimg } from '../controller/controller.ejercicio';
const router = express.Router()
// ruta para el crud de la tabla ejercicio
router.post('/registrar', cargarimg, registrarEjercicio);
router.get('/listar', listarEjercicio);
router.put('/actualizar/:id_ejercicio', cargarimg, actualizarEjercicio);
router.delete('/eliminar/:id_ejercicio', eliminarEjercicio);
router.get('/listarPorZonaMuscular/:zonaMuscular', listarEjerciciosPorZonaMuscular);
router.get('/buscarPorNombre/:nombre', buscarEjercicioPorNombre);

export default router;