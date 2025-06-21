import e, { Request, Response } from 'express';
import { pool } from '../data/conexion.data';
import { Ejercicio } from '../types/type.ejercicio';
import multer from 'multer';
import { validarExtensionImagen } from '../helpers/helper';
import { verificarEjercicioPorId, validarEjercicio } from '../helpers/ejercicio.helper';
import fs from 'fs';
import path from 'path';

// funcion para subir imagenes de los ejercicios y crear carpetas por nombre de ejercicio para que quede mas ordenado
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const nombre_ejercicio = req.body.nombre_ejercicio || 'generico';
        const dir = path.join(__dirname, '../public/img/ejercicios', nombre_ejercicio);

        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        cb(null, dir);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });
// Cambia a array para aceptar varias imágenes
export const cargarimg = upload.array('foto_ejercicio', 10); // hasta 10 imágenes

export const listarEjercicio = async (_req: Request, res: Response) => {
    try {
        const resultado = await pool.query('SELECT * FROM ejercicio');
        if (resultado.rows.length > 0) {
            resultado.rows.forEach(row => {
                try {
                    row.foto_ejercicio = JSON.parse(row.foto_ejercicio);
                } catch {
                    // Si no es un JSON válido, lo convierte en array de un solo elemento
                    row.foto_ejercicio = [row.foto_ejercicio];
                }
            });
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
        const files = req.files as Express.Multer.File[];
        const nombres_fotos = files && files.length > 0
            ? files.map(file => file.filename)
            : ['default.jpg'];

        // Validar extensiones
        for (const nombre_foto of nombres_fotos) {
            if (!validarExtensionImagen(nombre_foto)) {
                res.status(400).json({ message: 'La imagen debe ser de tipo jpg, jpeg o png', status: 400 });
                return;
            }
        }

        const ejercicio: Ejercicio = {
            id_ejercicio: req.body.id_ejercicio,
            nombre_ejercicio: req.body.nombre_ejercicio,
            descripcion: req.body.descripcion,
            zona_muscular: req.body.zona_muscular,
            foto_ejercicio: JSON.stringify(nombres_fotos) // Guarda como string JSON
        };

        const { valido, errores } = validarEjercicio(ejercicio);
        if (!valido) {
            res.status(400).json({ message: 'Datos inválidos: ' + errores.join(', '), status: 400 });
            return;
        }

        const existeEjercicio = await verificarEjercicioPorId(ejercicio.id_ejercicio ? ejercicio.id_ejercicio : 0);

        if (ejercicio.id_ejercicio && existeEjercicio) {
            res.status(400).json({ message: 'El ejercicio ya existe, verifique el ID', status: 400 });
            return;
        }

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
        const files = req.files as Express.Multer.File[];
        const nombres_fotos = files && files.length > 0
            ? files.map(file => file.filename)
            : ['default.jpg'];

        for (const nombre_foto of nombres_fotos) {
            if (!validarExtensionImagen(nombre_foto)) {
                res.status(400).json({ message: 'La imagen debe ser de tipo jpg, jpeg o png', status: 400 });
                return;
            }
        }

        const ejercicio: Ejercicio = {
            id_ejercicio: req.body.id_ejercicio,
            nombre_ejercicio: req.body.nombre_ejercicio,
            descripcion: req.body.descripcion,
            zona_muscular: req.body.zona_muscular,
            foto_ejercicio: JSON.stringify(nombres_fotos)
        };

        const id_ejercicio = Number(req.params.id_ejercicio);
        const existeEjercicio = await verificarEjercicioPorId(id_ejercicio);

        if (!existeEjercicio) {
            res.status(404).json({ message: 'Ejercicio no encontrado, verifique que el ID sea válido', status: 404 });
            return;
        }

        const { valido, errores } = validarEjercicio(ejercicio);
        if (!valido) {
            res.status(400).json({ message: 'Datos inválidos: ' + errores.join(', '), status: 400 });
            return;
        }

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


// en porceso de mejora 

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
