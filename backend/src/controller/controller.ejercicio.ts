import e, { Request, Response } from 'express';
import { pool } from '../data/conexion.data';

type ejercicio = {
    id_ejercicio: number,
    nombre_ejercicio: string,
    descripcion: string,
    zona_muscular: string,
    foto_ejercicio: string
};

export const listarEjercicio = async (_req: Request, res: Response) => {
    try {
        const resultado = await pool.query('SELECT * FROM ejercicio');
        if (resultado.rows.length > 0) {
            res.status(200).json(resultado.rows);
        } else {
            res.status(404).json({ message: 'No se encontraron ejercicios para listar' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error al listar los ejercicios: ' + error, status: 500 });
    }
};
export const registrarEjercicio = async (req: Request, res: Response) => {
    try {
        const ejercicio: ejercicio = {
            id_ejercicio: req.body.id_ejercicio,
            nombre_ejercicio: req.body.nombre_ejercicio,
            descripcion: req.body.descripcion,
            zona_muscular: req.body.zona_muscular,
            foto_ejercicio: req.body.foto_ejercicio
        };

        const sql = `
            INSERT INTO ejercicio (id_ejercicio, nombre_ejercicio, descripcion, zona_muscular, foto_ejercicio)
            VALUES ($1, $2, $3, $4, $5)`;

        const resultado = await pool.query(sql, [
            ejercicio.id_ejercicio,
            ejercicio.nombre_ejercicio,
            ejercicio.descripcion,
            ejercicio.zona_muscular,
            ejercicio.foto_ejercicio
        ]);

        if (resultado.rowCount && resultado.rowCount > 0) {
            res.status(201).json({ message: 'Ejercicio registrado exitosamente' });
        } else {
            res.status(400).json({ message: 'No se pudo registrar el ejercicio' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error al registrar el ejercicio: ' + error, status: 500 });
    }
};
export const actualizarEjercicio = async (req: Request, res: Response) => {
    try {
        const ejercicio: ejercicio = {
            id_ejercicio: req.body.id_ejercicio,
            nombre_ejercicio: req.body.nombre_ejercicio,
            descripcion: req.body.descripcion,
            zona_muscular: req.body.zona_muscular,
            foto_ejercicio: req.body.foto_ejercicio
        };

        const sql = `
            UPDATE ejercicio
            SET nombre_ejercicio = $2, descripcion = $3, zona_muscular = $4, foto_ejercicio = $5
            WHERE id_ejercicio = $1`;

        const resultado = await pool.query(sql, [
            ejercicio.id_ejercicio,
            ejercicio.nombre_ejercicio,
            ejercicio.descripcion,
            ejercicio.zona_muscular,
            ejercicio.foto_ejercicio
        ]);

        if (resultado.rowCount && resultado.rowCount > 0) {
            res.status(200).json({ message: 'Ejercicio actualizado exitosamente' });
        } else {
            res.status(404).json({ message: 'No se encontró el ejercicio para actualizar' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el ejercicio: ' + error, status: 500 });
    }
};
export const eliminarEjercicio = async (req: Request, res: Response) => {
    try {
        const idEjercicio = parseInt(req.params.id);
        const sql = 'DELETE FROM ejercicio WHERE id_ejercicio = $1';
        const resultado = await pool.query(sql, [idEjercicio]);

        if (resultado.rowCount && resultado.rowCount > 0) {
            res.status(200).json({ message: 'Ejercicio eliminado exitosamente' });
        } else {
            res.status(404).json({ message: 'No se encontró el ejercicio para eliminar' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar el ejercicio: ' + error, status: 500 });
    }
};
export const obtenerEjercicioPorId = async (req: Request, res: Response) => {
    try {
        const idEjercicio = parseInt(req.params.id);
        const sql = 'SELECT * FROM ejercicio WHERE id_ejercicio = $1';
        const resultado = await pool.query(sql, [idEjercicio]);

        if (resultado.rows.length > 0) {
            res.status(200).json(resultado.rows[0]);
        } else {
            res.status(404).json({ message: 'No se encontró el ejercicio con el ID proporcionado' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el ejercicio: ' + error, status: 500 });
    }
};
export const buscarEjercicioPorNombre = async (req: Request, res: Response) => {
    try {
        const nombreEjercicio = req.query.nombre as string;
        const sql = 'SELECT * FROM ejercicio WHERE nombre_ejercicio ILIKE $1';
        const resultado = await pool.query(sql, [`%${nombreEjercicio}%`]);

        if (resultado.rows.length > 0) {
            res.status(200).json(resultado.rows);
        } else {
            res.status(404).json({ message: 'No se encontraron ejercicios con el nombre proporcionado' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error al buscar el ejercicio: ' + error, status: 500 });
    }
};
export const listarEjerciciosPorZonaMuscular = async (req: Request, res: Response) => {
    try {
        const zonaMuscular = req.query.zona as string;
        const sql = 'SELECT * FROM ejercicio WHERE zona_muscular ILIKE $1';
        const resultado = await pool.query(sql, [`%${zonaMuscular}%`]);

        if (resultado.rows.length > 0) {
            res.status(200).json(resultado.rows);
        } else {
            res.status(404).json({ message: 'No se encontraron ejercicios para la zona muscular proporcionada' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error al listar los ejercicios por zona muscular: ' + error, status: 500 });
    }
};
