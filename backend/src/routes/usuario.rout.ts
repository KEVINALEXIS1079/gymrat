import express from 'express'
import { listarUsuario,registrarUsuario,actualizarUsuario,eliminarUsuario,cargarimg,obtenerUsuarioPorId } from '../controller/controller.usuario'

const router = express.Router()

// ruta para el crud de la tabla usuario
router.post('/registrar',cargarimg, registrarUsuario);
router.get('/listar', listarUsuario);
router.get('/obtener/:id_usuario', obtenerUsuarioPorId);
router.put('/actualizar/:id_usuario', cargarimg, actualizarUsuario);
router.delete('/eliminar/:id_usuario', eliminarUsuario);

export default router;