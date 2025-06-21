import e, { Request, Response } from 'express';
import { pool } from '../data/conexion.data';
import multer from 'multer';
import { verificarUsuarioPorId,validarUsuario } from '../helpers/usuario.helper';
import { Usuario } from '../types/type.usuario';

//import verificarUsuario from '../helpers/helper';
/**
 * Controlador para manejar las operaciones relacionadas con los usuarios.
 * Incluye funciones para listar y registrar usuarios.
 * 
 * @module controller.usuario
 */

/**
 * Lista todos los usuarios registrados en la base de datos.
 * @function listarUsuario
 * @param {Request} req - La solicitud HTTP entrante (no se utiliza).  
 * @param {Response} res - La respuesta HTTP que se enviará al cliente.
 * @returns {Promise<void>} Respuesta con el estado y los datos de los usuarios o un mensaje de error.
 * */






//configuracion de multer para subir imagenes

const storage = multer.diskStorage({
    destination: function (req, foto_inicio, cb){
        cb(null,'src/public/img')
    },
    filename: function(req, foto_inicio, cb) {
        cb(null,foto_inicio.originalname)
    }
})

const upload = multer({storage: storage})
export const cargarimg= upload.single('foto_inicio');



export const listarUsuario = async (_req: Request, res: Response) => {
    try {
        const resultado = await pool.query('select * from usuario');
        if (resultado.rows.length > 0) {
            res.status(200).json(resultado.rows);
        } else {
            res.status(404).json({ message: 'no se encontraron usuarios para listar' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error al realizar el registro: ' + error, status: 500 });
    }
};

export const registrarUsuario = async (req: Request, res: Response) => {
    try {
        const nombre_foto = req.file?.filename || 'default.jpg'; // Asigna un valor por defecto si no se llega a subir pa quie no quede nulo

        const usuario: Usuario = {
            id_usuario: req.body.id_usuario,
            nombre_usuario: req.body.nombre_usuario,
            apellido_usuario: req.body.apellido_usuario,
            gmail: req.body.gmail,
            foto_inicio: nombre_foto,
            genero: req.body.genero
        };

        const existeUsuario = await verificarUsuarioPorId(usuario.id_usuario ? usuario.id_usuario : 0);

        if (usuario.id_usuario && existeUsuario) {
            res.status(400).json({ message: 'el usuario ya existe, verifique el id', status: 400 });
            return;
        }

        // Validar los datos del usuario antes de insertarlo
        const { valido, errores } = validarUsuario(usuario);
        if (!valido) {
            res.status(400).json({ message: 'Datos inválidos: ' + errores.join(', '), status: 400 });
            return;
        }

        const sql = `
                INSERT INTO usuario (id_usuario, nombre_usuario, apellido_usuario,gmail, foto_inicio, genero) VALUES ($1, $2, $3, $4, $5, $6)`;

        const resultado = await pool.query(sql, [
            usuario.id_usuario,
            usuario.nombre_usuario,
            usuario.apellido_usuario,
            usuario.gmail,
            usuario.foto_inicio,
            usuario.genero
        ]);

        if (resultado.rowCount && resultado.rowCount > 0) {
            res.status(200).json({ message: 'se registró el usuario', status: 200 });
        } else {
            res.status(404).json({ message: 'no se registró el usuario', status: 404 });
        }
    } catch (error) {
        res.status(500).json({ message: 'error al realizar el registro: ' + error, status: 500 });
    }
};

export const actualizarUsuario = async (req: Request, res: Response) => {
    try {
    // Verificar si el usuario existe antes de actualizar
    const nombre_foto = req.file?.filename || 'default.jpg';


    const id_usuario = Number(req.params.id_usuario);
    const existeUsuario = await verificarUsuarioPorId(id_usuario);

    if (!existeUsuario) {
        res.status(404).json({ message: 'usuario no encontrado verifique que el id sea valido', status: 404 });
        return;
    }

    // Si el usuario existe, proceder con la actualización
        const usuario: Usuario = {
            nombre_usuario: req.body.nombre_usuario,
            apellido_usuario: req.body.apellido_usuario,
            gmail: req.body.gmail,
            foto_inicio: nombre_foto,
            genero: req.body.genero
        };
        
        const sql = `
                UPDATE usuario SET nombre_usuario = $2, apellido_usuario = $3, gmail = $4, foto_inicio = $5, genero = $6 WHERE id_usuario = $1`;
        const resultado = await pool.query(sql, [
            id_usuario,
            usuario.nombre_usuario,
            usuario.apellido_usuario,
            usuario.gmail,
            usuario.foto_inicio,
            usuario.genero
        ]);

        if (resultado.rowCount && resultado.rowCount > 0) {
            res.status(200).json({ message: 'se actualizó el usuario', status: 200 });
            return;
        } else {
            res.status(404).json({ message: 'no se actualizó el usuario', status: 404 });
            return;
        }
    } catch (error) {
        res.status(500).json({ message: 'error al actualizar el registro: ' + error, status: 500 });
    }
};

export const eliminarUsuario = async (req: Request, res: Response) => {
    try {
        const id_usuario = Number(req.params.id_usuario);

        const existeUsuario = await verificarUsuarioPorId(id_usuario);

    if (!existeUsuario) {
        res.status(404).json({ message: 'usuario no encontrado verifique que el id sea valido', status: 404 });
        return;
    }
        const sql = `
                DELETE FROM usuario WHERE id_usuario = $1`;

        const resultado = await pool.query(sql, [id_usuario]);

        if (resultado.rowCount && resultado.rowCount > 0) {
            res.status(200).json({ message: 'se eliminó el usuario', status: 200 });
        } else {
            res.status(404).json({ message: 'no se eliminó el usuario', status: 404 });
        }
    } catch (error) {
        res.status(500).json({ message: 'error al eliminar el registro: ' + error, status: 500 });
    }
};
