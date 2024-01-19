import { Request, Response, NextFunction } from 'express';
import pool from '../database';

class AutorsController {

    public async createAutors(req: Request, res: Response): Promise<void> {
        const resp = await pool.query("INSERT INTO Autores set ?",[req.body]);
    res.json(resp);
    }
    
    public async showAutors(req: Request, res: Response): Promise<void> {
        const respuesta = await pool.query(`SELECT * FROM Autores;`);
        res.json( respuesta );
    }  

    public async UpdateAutors(req: Request, res: Response): Promise<void> {
        const {id} = req.params;
        const respuesta = await pool.query("UPDATE Autores set ? WHERE autorID = ?", [req.body, id]);
        res.json(respuesta);
    }

    public async DeleteAutors(req: Request, res: Response): Promise<void> {
        const {id} = req.params;
        const respuesta = await pool.query("DELETE FROM Autores  WHERE autorID = ?", [id]);
        res.json(respuesta);
    }  

}
export const autorsController = new AutorsController();