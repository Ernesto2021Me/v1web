import { Request, Response, NextFunction } from 'express';
import pool from '../database';

class LoansController {

    public async createloans(req: Request, res: Response): Promise<void> {
        const { Nombre, Titulo } = req.body;
    
        try {
            // Obtener libroID
            const libroResult = await pool.query('SELECT libroID FROM Libros WHERE titulo = ?', [Titulo]);
    
            if (libroResult.length === 0 || !libroResult[0].libroID) {
                res.status(404).json({ error: 'Libro no encontrado' });
                return;
            }
    
            const libroID = libroResult[0].libroID;
    
            // Obtener usuarioID
            const usuarioResult = await pool.query('SELECT usuarioID FROM Usuarios WHERE nombre = ?', [Nombre]);
    
            if (usuarioResult.length === 0 || !usuarioResult[0].usuarioID) {
                res.status(404).json({ error: 'Usuario no encontrado' });
                return;
            }
    
            const usuarioID = usuarioResult[0].usuarioID;
    
            // Insertar préstamo
            const resp = await pool.query("INSERT INTO Prestamos (usuarioID, libroID) VALUES (?, ?);", [usuarioID, libroID]);
            res.json(resp);
        } catch (error) {
            console.error('Error al crear préstamo:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }
    

    public async showpersonalLoans(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        const prestamosexpirados = await pool.query(`SELECT prestamoID, libroID FROM Prestamos
            WHERE estado = 'No Devuelto' AND DATEDIFF(fechaRecibo, CURRENT_DATE()) <= 0 
              AND usuarioID =  ?`,
            [id]
        );
        if(prestamosexpirados.length>0){
            for (const prestamo of prestamosexpirados) {
                const prestamoID = prestamo.prestamoID;
    
                // Paso 2: Cambiar el estado a 'Devuelto'
                await pool.query('UPDATE Prestamos SET estado = "Devuelto" WHERE prestamoID = ?', [prestamoID]);
    
                // Paso 3: Insertar en la lista de lectura
                await pool.query('INSERT INTO ListasLectura (usuarioID, libroID) VALUES (?, ?)', [id, prestamo.libroID]);
            }
        }
        
        const respuesta = await pool.query(
            `SELECT P.prestamoID, L.titulo, L.descripcion, G.nombre AS genero, L.enlace,DATEDIFF(P.fechaRecibo, CURRENT_DATE()) AS tiempo_disponible 
            FROM Prestamos P 
            JOIN Libros L ON P.libroID = L.libroID 
            JOIN LibrosGeneros LG ON L.libroID = LG.libroID 
            JOIN Generos G ON LG.generoID = G.generoID 
            WHERE P.estado = 'No Devuelto' AND P.usuarioID = ?`,
            [id]
        );
        if(respuesta.length>0){
            res.json(respuesta);
            return ;
        }
        res.status(403).json({'mensaje':'No existen prestamos'});
    }

    public async showLoans(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        const prestamosexpirados = await pool.query(`SELECT prestamoID, libroID FROM Prestamos
            WHERE estado = 'No Devuelto' AND DATEDIFF(fechaRecibo, fechaExpedicion) <= 0
              AND usuarioID =  ?`,
            [id]
        );
        if(prestamosexpirados.length>0){
            for (const prestamo of prestamosexpirados) {
                const prestamoID = prestamo.prestamoID;
    
                // Paso 2: Cambiar el estado a 'Devuelto'
                await pool.query('UPDATE Prestamos SET estado = "Devuelto" WHERE prestamoID = ?', [prestamoID]);
    
                // Paso 3: Insertar en la lista de lectura
                await pool.query('INSERT INTO ListasLectura (usuarioID, libroID) VALUES (?, ?)', [id, prestamo.libroID]);
            }
        }
        
        const respuesta = await pool.query(
            `SELECT P.prestamoID, L.titulo, L.descripcion, G.nombre AS genero, L.enlace, P.estado 
            FROM Prestamos P JOIN Libros L ON P.libroID = L.libroID 
            JOIN LibrosGeneros LG ON L.libroID = LG.libroID 
            JOIN Generos G ON LG.generoID = G.generoID WHERE P.usuarioID =?;`,
            [id]
        );
        if(respuesta.length>0){
            res.json(respuesta);
            return ;
        }
        res.status(403).json({'mensaje':'No existen prestamos'});
    }


    public async Updateloans(req: Request, res: Response): Promise<void> {
        const {id} = req.params;
        const resp = await pool.query("UPDATE Prestamos SET Estado = 'Devuelto' WHERE prestamoID =?",[id]);
        res.json(resp);
    }
    
    
}
export const loansController = new LoansController();