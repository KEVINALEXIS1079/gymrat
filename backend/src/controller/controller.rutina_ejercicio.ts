import e, { Request, Response } from 'express';
import { pool } from '../data/conexion.data';

type rutina_ejercicio = {
    id_rutina_ejercicio: number,
    rutina_fk: number,
    ejercicio_fk: number,
    series: number,
    repeticiones: number,
    peso: number,
    descripcion: string
};
export const listarRutinaEjercicio = async (_req: Request, res: Response) => {
    try {
        const resultado = await pool.query('SELECT * FROM rutina_ejercicio');
        if (resultado.rows.length > 0) {
            res.status(200).json(resultado.rows);
        } else {
            res.status(404).json({ message: 'No se encontraron rutinas de ejercicio para listar' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error al listar las rutinas de ejercicio: ' + error, status: 500 });
    }
};
export const registrarRutinaEjercicio = async (req: Request, res: Response) => {
    try {
        const rutinaEjercicio: rutina_ejercicio = {
            id_rutina_ejercicio: req.body.id_rutina_ejercicio,
            rutina_fk: req.body.rutina_fk,
            ejercicio_fk: req.body.ejercicio_fk,
            series: req.body.series,
            repeticiones: req.body.repeticiones,
            peso: req.body.peso,
            descripcion: req.body.descripcion
        };

        const sql = `
            INSERT INTO rutina_ejercicio (id_rutina_ejercicio, rutina_fk, ejercicio_fk, series, repeticiones, peso, descripcion, zona_muscular)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`;

        const resultado = await pool.query(sql, [
            rutinaEjercicio.id_rutina_ejercicio,
            rutinaEjercicio.rutina_fk,
            rutinaEjercicio.ejercicio_fk,
            rutinaEjercicio.series,
            rutinaEjercicio.repeticiones,
            rutinaEjercicio.peso,
            rutinaEjercicio.descripcion
        ]);

        if (resultado.rowCount && resultado.rowCount > 0) {
            res.status(201).json({ message: 'Rutina de ejercicio registrada exitosamente' });
        } else {
            res.status(400).json({ message: 'No se pudo registrar la rutina de ejercicio' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error al registrar la rutina de ejercicio: ' + error, status: 500 });
    }
};
export const actualizarRutinaEjercicio = async (req: Request, res: Response) => {
    try {
        const rutinaEjercicio: rutina_ejercicio = {
            id_rutina_ejercicio: req.body.id_rutina_ejercicio,
            rutina_fk: req.body.rutina_fk,
            ejercicio_fk: req.body.ejercicio_fk,
            series: req.body.series,
            repeticiones: req.body.repeticiones,
            peso: req.body.peso,
            descripcion: req.body.descripcion
        };

        const sql = `
            UPDATE rutina_ejercicio
            SET rutina_fk = $2, ejercicio_fk = $3, series = $4, repeticiones = $5, peso = $6, descripcion = $7, zona_muscular = $8
            WHERE id_rutina_ejercicio = $1`;

        const resultado = await pool.query(sql, [
            rutinaEjercicio.id_rutina_ejercicio,
            rutinaEjercicio.rutina_fk,
            rutinaEjercicio.ejercicio_fk,
            rutinaEjercicio.series,
            rutinaEjercicio.repeticiones,
            rutinaEjercicio.peso,
            rutinaEjercicio.descripcion,
        ]);

        if (resultado.rowCount && resultado.rowCount > 0) {
            res.status(200).json({ message: 'Rutina de ejercicio actualizada exitosamente' });
        } else {
            res.status(404).json({ message: 'No se encontró la rutina de ejercicio para actualizar' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar la rutina de ejercicio: ' + error, status: 500 });
    }
};
export const eliminarRutinaEjercicio = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id_rutina_ejercicio);
        const sql = 'DELETE FROM rutina_ejercicio WHERE id_rutina_ejercicio = $1';
        const resultado = await pool.query(sql, [id]);

        if (resultado.rowCount && resultado.rowCount > 0) {
            res.status(200).json({ message: 'Rutina de ejercicio eliminada exitosamente' });
        } else {
            res.status(404).json({ message: 'No se encontró la rutina de ejercicio para eliminar' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar la rutina de ejercicio: ' + error, status: 500 });
    }
};