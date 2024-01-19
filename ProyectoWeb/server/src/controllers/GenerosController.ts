import { Request, Response, NextFunction } from 'express';
import pool from '../database';

class GenerosController {
    public async createGeners(req: Request, res: Response): Promise<void> {
        const resp = await pool.query("INSERT INTO Generos set ?",[req.body]);
    res.json(resp);
    }
    
    public async showGeners(req: Request, res: Response): Promise<void> {
        const respuesta = await pool.query(`SELECT * FROM Generos;`);
        res.json( respuesta );
    }  

    public async UpdateGeners(req: Request, res: Response): Promise<void> {
        const {id} = req.params;
        const respuesta = await pool.query("UPDATE Generos set ? WHERE generoID = ?", [req.body, id]);
        res.json(respuesta);
    }

    public async DeleteGeners(req: Request, res: Response): Promise<void> {
        const {id} = req.params;
        const respuesta = await pool.query("DELETE FROM Generos  WHERE generoID = ?", [id]);
        res.json(respuesta);
    }  

}
export const generosController = new GenerosController();