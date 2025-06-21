import express from 'express'
import { listarUsuario,registrarUsuario,actualizarUsuario,eliminarUsuario } from '../controller/controller.usuario'



const router = express.Router()

// ruta para el crud de la tabla usuario

router.post('/registrar', registrarUsuario);
router.get('/listar', listarUsuario);
router.put('/actualizar', actualizarUsuario);
router.delete('/eliminar/:id_usuario', eliminarUsuario);

export default router