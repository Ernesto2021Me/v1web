import { Request, Response, NextFunction } from 'express';
import pool from '../database';

class ReviewController {
   
    public async createReview(req: Request, res: Response): Promise<void> {
        const { nombre, titulo, calificacion, comentario } = req.body;
    
        try {
            // Obtener usuarioID
            const usuarioResult = await pool.query('SELECT usuarioID FROM Usuarios WHERE nombre = ?', [nombre]);
            if (!usuarioResult || !usuarioResult[0] || !usuarioResult[0].usuarioID) {
                res.status(404).json({ error: 'Usuario no encontrado' });
                return;
            }
            const usuarioID = usuarioResult[0].usuarioID;
    
            // Obtener libroID
            const libroResult = await pool.query('SELECT libroID FROM Libros WHERE titulo = ?', [titulo]);
            if (!libroResult || !libroResult[0] || !libroResult[0].libroID) {
                res.status(404).json({ error: 'Libro no encontrado' });
                return;
            }
            const libroID = libroResult[0].libroID;
    
            // Insertar la nueva reseña
            const resp = await pool.query(
                'INSERT INTO Reseñas (usuarioID, libroID, calificacion, comentario) VALUES (?, ?, ?, ?)',
                [usuarioID, libroID, calificacion, comentario]
            );
    
            res.json(resp);
        } catch (error) {
            console.error('Error al crear la reseña:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }
    
   public async showpersonalsreviews(req: Request, res: Response): Promise<void> {
    const {id} = req.params;
    const respuesta = await pool.query(' SELECT R.resenaID, L.titulo, R.calificacion, R.comentario FROM Reseñas R JOIN Libros L ON R.libroID = L.libroID WHERE R.usuarioID =?;', [id]);
    if(respuesta.length>0){
        res.json(respuesta);
        return ;
    }
    res.status(403).json({ mensaje: 'No existen reseñas' });
}  
   
public async Updatereviews(req: Request, res: Response): Promise<void> {
    const {id} = req.params;
    const respuesta = await pool.query("UPDATE Reseñas set ? WHERE resenaID = ?", [req.body, id]);
    res.json(respuesta);
}

public async Deletereviews(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
const resp = await pool.query(`DELETE FROM Reseñas WHERE resenaID = ${id}`);
res.json(resp);
}    
}
export const reviewController = new ReviewController();