import {Request,Response} from 'express';
import pool from '../database'; 
class UsersController{

    public async createUser(req: Request, res: Response): Promise<void> {
        const resp = await pool.query("INSERT INTO Usuarios set ?",[req.body]);
        res.json(resp);
    }

    public async ShowUsers(req: Request, res: Response): Promise<void> {
        const respuesta = await pool.query(`SELECT U.usuarioID, U.nombre, U.correoElectronico
        FROM Usuarios U
        LEFT JOIN Administradores A ON U.usuarioID = A.usuarioID
        WHERE A.usuarioID IS NULL;
        `);
    
        res.json(respuesta);
    }

    public async ValidateUsers(req: Request, res: Response): Promise<void> {
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

    public async SearchUserpersonal(req: Request, res: Response): Promise<void> {
        const {id} = req.params;
        const respuesta = await pool.query(
            'SELECT U.usuarioID, U.nombre, U.correoElectronico, U.contrasena ' +
            'FROM Usuarios U ' +
            'LEFT JOIN Administradores A ON U.usuarioID = A.usuarioID ' +
            'WHERE U.usuarioID = ? AND A.usuarioID IS NULL',
            [id]);
        res.json(respuesta);
    }

    public async UpdateUsers(req: Request, res: Response): Promise<void> {
        const {id} = req.params;
        const respuesta = await pool.query("UPDATE Usuarios set ? WHERE usuarioID = ?", [req.body, id]);
        res.json(respuesta);
    }

    public async DeleteUsers(req: Request, res: Response): Promise<void> {
        const {id} = req.params;
        const respuesta = await pool.query("DELETE FROM Usuarios WHERE usuarioID = ?", [id]);
        res.json(respuesta);
    }

}
export const usersController = new UsersController();