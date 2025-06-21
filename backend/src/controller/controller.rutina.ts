import e, { Request, Response } from 'express';
import { pool } from '../data/conexion.data';

/**
 * Controlador para manejar las operaciones relacionadas con el progreso de los usuarios.
 * Incluye funciones para listar y registrar el progreso.
 * 
 * @module controller.progreso
 */
type rutina = {
    id_rutina: number,
    tiempo_rutina: number,
    fehca_inicio: Date,
    fecha_fin: Date,
    descripcion: string,
}

export const listarRutina = async (_req: Request, res: Response) => {
    try {
        const resultado = await pool.query('SELECT * FROM rutina');
        if (resultado.rows.length > 0) {
            res.status(200).json(resultado.rows);
        } else {
            res.status(404).json({ message: 'No se encontraron rutinas para listar' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error al listar las rutinas: ' + error, status: 500 });
    }
};
export const registrarRutina = async (req: Request, res: Response) => {
    try {
        const rutina: rutina = {
            id_rutina: req.body.id_rutina,
            tiempo_rutina: req.body.tiempo_rutina,
            fehca_inicio: req.body.fehca_inicio,
            fecha_fin: req.body.fecha_fin,
            descripcion: req.body.descripcion
        };

        const sql = `
            INSERT INTO rutina (id_rutina, tiempo_rutina, fehca_inicio, fecha_fin, descripcion)
            VALUES ($1, $2, $3, $4, $5)`;

        const resultado = await pool.query(sql, [
            rutina.id_rutina,
            rutina.tiempo_rutina,
            rutina.fehca_inicio,
            rutina.fecha_fin,
            rutina.descripcion
        ]);

        if (resultado.rowCount && resultado.rowCount > 0) {
            res.status(201).json({ message: 'Rutina registrada exitosamente' });
        } else {
            res.status(400).json({ message: 'No se pudo registrar la rutina' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error al registrar la rutina: ' + error, status: 500 });
    }
};
export const actualizarRutina = async (req: Request, res: Response) => {
    try {
        const rutina: rutina = {
            id_rutina: req.body.id_rutina,
            tiempo_rutina: req.body.tiempo_rutina,
            fehca_inicio: req.body.fehca_inicio,
            fecha_fin: req.body.fecha_fin,
            descripcion: req.body.descripcion
        };

        const sql = `
            UPDATE rutina
            SET tiempo_rutina = $2, fehca_inicio = $3, fecha_fin = $4, descripcion = $5
            WHERE id_rutina = $1`;

        const resultado = await pool.query(sql, [
            rutina.id_rutina,
            rutina.tiempo_rutina,
            rutina.fehca_inicio,
            rutina.fecha_fin,
            rutina.descripcion
        ]);

        if (resultado.rowCount && resultado.rowCount > 0) {
            res.status(200).json({ message: 'Rutina actualizada exitosamente' });
        } else {
            res.status(404).json({ message: 'Rutina no encontrada o no se realizaron cambios' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar la rutina: ' + error, status: 500 });
    }
};
export const eliminarRutina = async (req: Request, res: Response) => {
    try {
        const id_rutina = parseInt(req.params.id_rutina);
        const sql = 'DELETE FROM rutina WHERE id_rutina = $1';
        const resultado = await pool.query(sql, [id_rutina]);

        if (resultado.rowCount && resultado.rowCount > 0) {
            res.status(200).json({ message: 'Rutina eliminada exitosamente' });
        } else {
            res.status(404).json({ message: 'Rutina no encontrada' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar la rutina: ' + error, status: 500 });
    }
};
