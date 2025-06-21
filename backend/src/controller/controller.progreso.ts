import e, { Request, Response } from 'express';
import { pool } from '../data/conexion.data';
import { Progreso } from '../types/type.progreso';
import multer from 'multer'; 
import { verificarProgresoPorId, validarProgreso } from '../helpers/progreso.helper';
import { validarExtensionImagen } from '../helpers/helper';
import fs from 'fs';
import path from 'path';

// Configuracion de multer para varias imagenes y que cree carpetas por usuario
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const usuario_fk = req.body.usuario_fk || 'generico';
        const dir = path.join(__dirname, '../public/img/progreso', usuario_fk.toString());
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
export const cargarimg = upload.array('foto_progreso', 10); // hasta 10 imagenes para subir, no creo que se suban mas 

export const listarProgreso = async (_req: Request, res: Response) => {
    try {
        const resultado = await pool.query('SELECT * FROM progreso');
        if (resultado.rows.length > 0) {
            resultado.rows.forEach(row => {
                try {
                    row.foto_progreso = JSON.parse(row.foto_progreso);
                } catch {
                    // Si no es un JSON valido, lo convierte en array de un solo elemento
                    row.foto_progreso = [row.foto_progreso];
                }
            });
            res.status(200).json(resultado.rows);
        } else {
            res.status(404).json({ message: 'No se encontraron progresos para listar' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error al listar los progresos: ' + error, status: 500 });
    }
};

export const obtenerProgresoPorId = async (req: Request, res: Response) => {
    try {
        const idProgreso = parseInt(req.params.id);
        const sql = 'SELECT * FROM progreso WHERE id_progreso = $1';
        const resultado = await pool.query(sql, [idProgreso]);

        if (resultado.rows.length > 0) {
            const row = resultado.rows[0];
            try {
                row.foto_progreso = JSON.parse(row.foto_progreso);
            } catch {
                row.foto_progreso = [row.foto_progreso];
            }
            res.status(200).json(row);
        } else {
            res.status(404).json({ message: 'No se encontró el progreso', status: 404 });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el progreso: ' + error, status: 500 });
    }
};

export const registrarProgreso = async (req: Request, res: Response) => {
    try {
        const files = req.files as Express.Multer.File[];
        const nombres_fotos = files && files.length > 0
            ? files.map(file => file.filename)
            : ['default.jpg'];

        // Validar extensiones
        for (const nombre_foto of nombres_fotos) {
            if (!validarExtensionImagen(nombre_foto)) {
                res.status(400).json({ message: 'La imagen debe ser de tipo jpg, jpeg, png o webp', status: 400 });
                return;
            }
        }

        const progreso: Progreso = {
            id_progreso: req.body.id_progreso,
            peso: req.body.peso,
            estatura: req.body.estatura,
            edad: req.body.edad,
            foto_progreso: JSON.stringify(nombres_fotos), // Guarda como string JSON
            usuario_fk: req.body.usuario_fk,
            fecha_progreso: req.body.fecha_progreso,
            rutina_fk: req.body.rutina_fk
        };

        const existeProgreso = await verificarProgresoPorId(progreso.id_progreso ? progreso.id_progreso : 0);

        if (progreso.id_progreso && existeProgreso) {
            res.status(400).json({ message: 'El progreso ya existe, verifique el id', status: 400 });
            return;
        }

        // Validar los datos del progreso antes de insertarlo
        const { valido, errores } = validarProgreso(progreso);
        if (!valido) {
            res.status(400).json({ message: 'Datos inválidos: ' + errores.join(', '), status: 400 });
            return;
        }

        const sql = `
            INSERT INTO progreso (id_progreso, peso, estatura, edad, foto_progreso, usuario_fk, fecha, rutina_fk)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`;

        const resultado = await pool.query(sql, [
            progreso.id_progreso,
            progreso.peso,
            progreso.estatura,
            progreso.edad,
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
        const files = req.files as Express.Multer.File[];
        const nombres_fotos = files && files.length > 0
            ? files.map(file => file.filename)
            : ['default.jpg'];

        for (const nombre_foto of nombres_fotos) {
            if (!validarExtensionImagen(nombre_foto)) {
                res.status(400).json({ message: 'La imagen debe ser de tipo jpg, jpeg, png o webp', status: 400 });
                return;
            }
        }

        const progreso: Progreso = {
            id_progreso: req.body.id_progreso,
            peso: req.body.peso,
            edad: req.body.edad,
            estatura: req.body.estatura,
            foto_progreso: JSON.stringify(nombres_fotos),
            usuario_fk: req.body.usuario_fk,
            fecha_progreso: req.body.fecha_progreso,
            rutina_fk: req.body.rutina_fk
        };

        const existeProgreso = await verificarProgresoPorId(progreso.id_progreso ? progreso.id_progreso : 0);

        if (!existeProgreso) {
            res.status(404).json({ message: 'No se encontró el progreso para actualizar', status: 404 });
            return;
        }

        // Validar los datos antes de actualizar
        const { valido, errores } = validarProgreso(progreso);
        if (!valido) {
            res.status(400).json({ message: 'Datos inválidos: ' + errores.join(', '), status: 400 });
            return;
        }

        const sql = `
            UPDATE progreso
            SET peso = $2, estatura = $3, edad = $4, foto_progreso = $5, usuario_fk = $6, fecha = $7, rutina_fk = $8
            WHERE id_progreso = $1`;

        const resultado = await pool.query(sql, [
            progreso.id_progreso,
            progreso.peso,
            progreso.estatura,
            progreso.edad,
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