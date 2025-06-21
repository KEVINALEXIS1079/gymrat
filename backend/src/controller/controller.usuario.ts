import e, { Request, Response } from 'express';
import { pool } from '../data/conexion.data';

/**
 * Controlador para manejar las operaciones relacionadas con los usuarios.
 * Incluye funciones para listar y registrar usuarios.
 * 
 * @module controller.usuario
 */

/**
 * Lista todos los usuarios registrados en la base de datos.
 * @function listarUsuario
 * @param {Request} _req - La solicitud HTTP entrante (no se utiliza).  
 * @param {Response} res - La respuesta HTTP que se enviará al cliente.
 * @returns {Promise<void>} Respuesta con el estado y los datos de los usuarios o un mensaje de error.
 * */



    type usuario = {
    id_usuario: number,
    nombre_usuario: string,
    apellido_usuario: string,
    gmail: string,
    foto_inicio: string,
    genero: string
    };

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

        const usuario: usuario = {
            id_usuario: req.body.id_usuario,
            nombre_usuario: req.body.nombre_usuario,
            apellido_usuario: req.body.apellido_usuario,
            gmail: req.body.gmail,
            foto_inicio: req.body.foto_inicio,
            genero: req.body.genero
        };

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
        const usuario: usuario = {
            id_usuario: req.body.id_usuario,
            nombre_usuario: req.body.nombre_usuario,
            apellido_usuario: req.body.apellido_usuario,
            gmail: req.body.gmail,
            foto_inicio: req.body.foto_inicio,
            genero: req.body.genero
        };

        const sql = `
                UPDATE usuario SET nombre_usuario = $2, apellido_usuario = $3, gmail = $4, foto_inicio = $5, genero = $6 WHERE id_usuario = $1`;

        const resultado = await pool.query(sql, [
            usuario.id_usuario,
            usuario.nombre_usuario,
            usuario.apellido_usuario,
            usuario.gmail,
            usuario.foto_inicio,
            usuario.genero
        ]);

        if (resultado.rowCount && resultado.rowCount > 0) {
            res.status(200).json({ message: 'se actualizó el usuario', status: 200 });
        } else {
            res.status(404).json({ message: 'no se actualizó el usuario', status: 404 });
        }
    } catch (error) {
        res.status(500).json({ message: 'error al actualizar el registro: ' + error, status: 500 });
    }
};

export const eliminarUsuario = async (req: Request, res: Response) => {
    try {
        const id_usuario = req.params.id_usuario;

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
