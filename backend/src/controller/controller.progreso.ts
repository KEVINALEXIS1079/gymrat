import e, { Request, Response } from 'express';
import { pool } from '../data/conexion.data';

/**
 * Controlador para manejar las operaciones relacionadas con el progreso de los usuarios.
 * Incluye funciones para listar y registrar el progreso.
 * 
 * @module controller.progreso
 */

type progreso = {
    id_progreso: number,
    peso: number,
    altura: number,
    foto_progreso: string,
    usuario_fk: number,
    fecha_progreso: Date,
    rutina_fk: number
};

export const listarProgreso = async (_req: Request, res: Response) => {
    try {
        const resultado = await pool.query('SELECT * FROM progreso');
        if (resultado.rows.length > 0) {
            res.status(200).json(resultado.rows);
        } else {
            res.status(404).json({ message: 'No se encontraron progresos para listar' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error al listar los progresos: ' + error, status: 500 });
    }
};

export const registrarProgreso = async (req: Request, res: Response) => {
    try {
        const progreso: progreso = {
            id_progreso: req.body.id_progreso,
            peso: req.body.peso,
            altura: req.body.altura,
            foto_progreso: req.body.foto_progreso,
            usuario_fk: req.body.usuario_fk,
            fecha_progreso: req.body.fecha_progreso,
            rutina_fk: req.body.rutina_fk
        };

        const sql = `
            INSERT INTO progreso (id_progreso, peso, altura, foto_progreso, usuario_fk, fecha_progreso, rutina_fk)
            VALUES ($1, $2, $3, $4, $5, $6, $7)`;

        const resultado = await pool.query(sql, [
            progreso.id_progreso,
            progreso.peso,
            progreso.altura,
            progreso.foto_progreso,
            progreso.usuario_fk,
            progreso.fecha_progreso,
            progreso.rutina_fk
        ]);

        if (resultado.rowCount && resultado.rowCount > 0) {
            res.status(200).json({ message: 'Se registró el progreso', status: 200 });
        } else {
            res.status(404).json({ message: 'No se registró el progreso', status: 404 });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error al realizar el registro: ' + error, status: 500 });
    }
};
export const actualizarProgreso = async (req: Request, res: Response) => {
    try {
        const progreso: progreso = {
            id_progreso: req.body.id_progreso,
            peso: req.body.peso,
            altura: req.body.altura,
            foto_progreso: req.body.foto_progreso,
            usuario_fk: req.body.usuario_fk,
            fecha_progreso: req.body.fecha_progreso,
            rutina_fk: req.body.rutina_fk
        };

        const sql = `
            UPDATE progreso
            SET peso = $2, altura = $3, foto_progreso = $4, usuario_fk = $5, fecha_progreso = $6, rutina_fk = $7
            WHERE id_progreso = $1`;

        const resultado = await pool.query(sql, [
            progreso.id_progreso,
            progreso.peso,
            progreso.altura,
            progreso.foto_progreso,
            progreso.usuario_fk,
            progreso.fecha_progreso,
            progreso.rutina_fk
        ]);

        if (resultado.rowCount && resultado.rowCount > 0) {
            res.status(200).json({ message: 'Se actualizó el progreso', status: 200 });
        } else {
            res.status(404).json({ message: 'No se actualizó el progreso', status: 404 });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el progreso: ' + error, status: 500 });
    }
};
export const eliminarProgreso = async (req: Request, res: Response) => {
    try {
        const id_progreso = parseInt(req.params.id_progreso);
        const sql = 'DELETE FROM progreso WHERE id_progreso = $1';
        const resultado = await pool.query(sql, [id_progreso]);

        if (resultado.rowCount && resultado.rowCount > 0) {
            res.status(200).json({ message: 'Se eliminó el progreso', status: 200 });
        } else {
            res.status(404).json({ message: 'No se encontró el progreso para eliminar', status: 404 });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar el progreso: ' + error, status: 500 });
    }
};