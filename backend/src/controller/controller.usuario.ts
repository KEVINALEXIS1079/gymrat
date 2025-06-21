import e, { Request, Response } from 'express';
import { pool } from '../data/conexion.data';
import multer from 'multer';
import { validarExtensionImagen } from '../helpers/helper';
import { verificarUsuarioPorId, validarUsuario } from '../helpers/usuario.helper';
import { Usuario } from '../types/type.usuario';
import fs from 'fs';
import path from 'path';

// Configuracion de multer para crear carpeta por usuario y aceptar varias imagenes para no tener eso enrredado
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const id_usuario = req.body.id_usuario;
        const nombre_usuario = req.body.nombre_usuario;
        const folderName = `${id_usuario}_${nombre_usuario}`;
        const dir = path.join(__dirname, '../public/img', folderName);

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
export const cargarimg = upload.array('foto_inicio', 10); // hasta 10 imágenes

export const listarUsuario = async (_req: Request, res: Response) => {
    try {
        const resultado = await pool.query('select * from usuario');
        if (resultado.rows.length > 0) {
            resultado.rows.forEach(row => {
                try {
                    row.foto_inicio = JSON.parse(row.foto_inicio);
                } catch {
                    // Si no es un JSON válido, lo convierte en array de un solo elemento
                    row.foto_inicio = [row.foto_inicio];
                }
            });
            res.status(200).json(resultado.rows);
        } else {
            res.status(404).json({ message: 'no se encontraron usuarios para listar' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error al realizar el registro: ' + error, status: 500 });
    }
};

export const obtenerUsuarioPorId = async (req: Request, res: Response) => {
    try {
        const id_usuario = Number(req.params.id_usuario);
        const sql = 'SELECT * FROM usuario WHERE id_usuario = $1';
        const resultado = await pool.query(sql, [id_usuario]);

        if (resultado.rows.length > 0) {
            const row = resultado.rows[0];
            try {
                row.foto_inicio = JSON.parse(row.foto_inicio);
            } catch {
                row.foto_inicio = [row.foto_inicio];
            }
            res.status(200).json(row);
        } else {
            res.status(404).json({ message: 'usuario no encontrado verifique que el id sea valido', status: 404 });
        }
    } catch (error) {
        res.status(500).json({ message: 'error al obtener el usuario por id: ' + error, status: 500 });
    }
};

export const registrarUsuario = async (req: Request, res: Response) => {
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

        const usuario: Usuario = {
            id_usuario: req.body.id_usuario,
            nombre_usuario: req.body.nombre_usuario,
            apellido_usuario: req.body.apellido_usuario,
            gmail: req.body.gmail,
            foto_inicio: JSON.stringify(nombres_fotos), // Guarda como string JSON
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
                INSERT INTO usuario (id_usuario, nombre_usuario, apellido_usuario, gmail, foto_inicio, genero) VALUES ($1, $2, $3, $4, $5, $6)`;

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

        const id_usuario = Number(req.params.id_usuario);
        const existeUsuario = await verificarUsuarioPorId(id_usuario);

        if (!existeUsuario) {
            res.status(404).json({ message: 'usuario no encontrado verifique que el id sea valido', status: 404 });
            return;
        }

        const usuario: Usuario = {
            nombre_usuario: req.body.nombre_usuario,
            apellido_usuario: req.body.apellido_usuario,
            gmail: req.body.gmail,
            foto_inicio: JSON.stringify(nombres_fotos),
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