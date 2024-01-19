import { Request, Response, NextFunction } from 'express';
import pool from '../database';

class AdministratorsController {

    public async createAdministrator(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        const resp = await pool.query("INSERT INTO Usuarios set ?",[req.body]);

        if (resp.affectedRows > 0) {
            // Obtener el usuarioID actualizado
            const usuarioID = resp.insertId;
            const respuesta = await pool.query("INSERT INTO Administradores SET ?", [{ usuarioID }]);
            res.json(respuesta);
        }
    }
    
    public async ValidateAdministrator(req: Request, res: Response): Promise<void> {
        const { correoElectronico, contrasena } = req.body;
        const resp = await pool.query( 'SELECT U.*, IFNULL(A.usuarioID, 0) AS esAdministrador ' +
        'FROM Usuarios U ' +
        'LEFT JOIN Administradores A ON U.usuarioID = A.usuarioID ' +
        'WHERE U.correoElectronico = ? AND U.contrasena = ?',
        [correoElectronico, contrasena]);
        if (resp.length > 0) {
            res.status(200).json({ mensaje: 'Acceso concedido' });
        } else {
            res.status(403).json({ mensaje: 'Usuario inexistente' });
        }  
    }

    public async ShowUsers(req: Request, res: Response): Promise<void> {
        const respuesta = await pool.query(`
        SELECT U.usuarioID,U.nombre,U.correoElectronico FROM Usuarios U INNER JOIN Administradores A ON U.usuarioID = A.usuarioID; `);
        res.json(respuesta);
    }

    public async SearchUserpersonal(req: Request, res: Response): Promise<void> {
        const {id} = req.params;
        const respuesta = await pool.query(
            'SELECT A.AdminID,U.usuarioID, U.nombre, U.correoElectronico, U.contrasena ' +
            'FROM Usuarios U ' +
            'INNER JOIN Administradores A ON U.usuarioID = A.usuarioID ' +
            'WHERE U.usuarioID = ?',[id]);
        res.json(respuesta);
    }


    public async UpdateAdministratos(req: Request, res: Response): Promise<void> {
        const {id} = req.params;
        const respuesta = await pool.query("UPDATE Usuarios set ? WHERE usuarioID = ?", [req.body, id]);
        res.json(respuesta);
    }

    public async DeleteAdministrators(req: Request, res: Response): Promise<void> {
        const {id} = req.params;
        const respuesta = await pool.query("DELETE FROM Usuarios WHERE usuarioID = ?", [id]);
        res.json(respuesta);
    }
}



export const administratorController = new AdministratorsController();