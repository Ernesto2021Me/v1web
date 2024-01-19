import { Request, Response, NextFunction } from 'express';
import pool from '../database';

class BooksController {
    public async createBooks(req: Request, res: Response): Promise<void> {
        const { Titulo, Autor, Descripcion, Genero, Formato, Enlace } = req.body;
    
        // Agrega esta verificación para asegurarte de que los valores no sean nulos o indefinidos.
        if (!Autor || !Genero) {
            res.status(400).json({ error: 'Los campos autor y genero son obligatorios.' });
            return;
        }
    
        try {
            const resp = await pool.query(
                'INSERT INTO Libros (titulo, descripcion, disponible, formato, enlace) VALUES (?, ?, true, ?, ?)',
                [Titulo, Descripcion, Formato, Enlace]);
    
            const autores = await pool.query('SELECT autorID FROM Autores WHERE nombre = ?', [Autor]);
            const generos = await pool.query('SELECT generoID FROM Generos WHERE nombre = ?', [Genero]);
    
            if (autores.length > 0) {
                const createAutorLibro = await pool.query(
                    'INSERT INTO AutoresLibros (autorID, libroID) VALUES (?, ?)', [autores[0].autorID, resp.insertId]);
            } else {
                if (Autor.trim() !== '') { // Asegúrate de que el nombre del autor no esté vacío.
                    try {
                        const createAutor = await pool.query('INSERT INTO Autores (nombre) VALUES (?)', [Autor]);
                        const createAutorLibro = await pool.query(
                            'INSERT INTO AutoresLibros (autorID, libroID) VALUES (?, ?)', [createAutor.insertId, resp.insertId]);
                    } catch (error) {
                        console.error('Error al insertar el autor:', error);
                        res.status(500).json({ error: 'Error al insertar el autor' });
                        return;
                    }
                }
            }
    
            if (generos.length > 0) {
                const createGeneroLibro = await pool.query(
                    'INSERT INTO LibrosGeneros (libroID, generoID) VALUES (?, ?)', [resp.insertId, generos[0].generoID]);
            } else {
                if (Genero.trim() !== '') { // Asegúrate de que el nombre del género no esté vacío.
                    try {
                        const createGenero = await pool.query('INSERT INTO Generos (nombre) VALUES (?)', [Genero]);
                        const createGeneroLibro = await pool.query(
                            'INSERT INTO LibrosGeneros (libroID, generoID) VALUES (?, ?)', [resp.insertId, createGenero.insertId]);
                    } catch (error) {
                        console.error('Error al insertar el género:', error);
                        res.status(500).json({ error: 'Error al insertar el género' });
                        return;
                    }
                }
            }
    
            res.json(resp);
        } catch (error) {
            console.error('Error general:', error);
            res.status(500).json({ error: 'Error al procesar la solicitud' });
        }
    }
    
    
    public async showBooks(req: Request, res: Response): Promise<void> {
        const respuesta = await pool.query(`
            SELECT
                L.libroID AS idlibro,
                L.titulo,
                A.nombre AS autor,
                L.descripcion
            FROM
                Libros L
                LEFT JOIN AutoresLibros AL ON L.libroID = AL.libroID
                LEFT JOIN Autores A ON AL.autorID = A.autorID
        `);
        res.json( respuesta );
    }  


    public async showBookspopular(req: Request, res: Response): Promise<void> {
        const respuesta = await pool.query(`
        SELECT
        L.libroID AS idlibro,
        L.titulo,
        A.nombre AS autor,
        L.descripcion,
        COUNT(R.resenaID) AS numResenas
    FROM
        Libros L
        LEFT JOIN AutoresLibros AL ON L.libroID = AL.libroID
        LEFT JOIN Autores A ON AL.autorID = A.autorID
        LEFT JOIN Reseñas R ON L.libroID = R.libroID
    GROUP BY
        L.libroID, L.titulo, A.nombre, L.descripcion
    HAVING
        numResenas >= 10
    ORDER BY
        numResenas DESC;
        `);
        res.json( respuesta );
    }
    
    
    public async showBooksrecomend(req: Request, res: Response): Promise<void> {
        const {id} = req.params;  
        const generoMasFrecuente = await pool.query(`
        SELECT
            G.nombre
        FROM
            ListasLectura LL
            JOIN Libros L ON LL.libroID = L.libroID
            JOIN LibrosGeneros LG ON L.libroID = LG.libroID
            JOIN Generos G ON LG.generoID = G.generoID
        WHERE
            LL.usuarioID = ? 
        GROUP BY
            G.nombre
        ORDER BY
            COUNT(LL.listaID) DESC
        LIMIT 1
    `, [id]);
    if (generoMasFrecuente.length > 0) {

        const genero = generoMasFrecuente[0].nombre;

        const recomendaciones = await pool.query(`
            SELECT
                L.libroID AS idlibro,
                L.titulo,
                A.nombre AS autor,
                L.descripcion
            FROM
                Libros L
                LEFT JOIN AutoresLibros AL ON L.libroID = AL.libroID
                LEFT JOIN Autores A ON AL.autorID = A.autorID
                LEFT JOIN LibrosGeneros LG ON L.libroID = LG.libroID
                LEFT JOIN Generos G ON LG.generoID = G.generoID
            WHERE
                G.nombre = ?
            LIMIT 5
        `, [genero]);

        res.json(recomendaciones);
    }
     
    }

    public async showBookdetails(req: Request, res: Response): Promise<void> {
        const { id} = req.params;
        const respuesta = await pool.query(`SELECT
        L.libroID AS idlibro,
        L.titulo,
        A.nombre AS autor,
        L.descripcion,
        G.nombre AS genero,
        R.calificacion,
        R.comentario
    FROM
        Libros L
        LEFT JOIN AutoresLibros AL ON L.libroID = AL.libroID
        LEFT JOIN Autores A ON AL.autorID = A.autorID
        LEFT JOIN LibrosGeneros LG ON L.libroID = LG.libroID
        LEFT JOIN Generos G ON LG.generoID = G.generoID
        LEFT JOIN Reseñas R ON L.libroID = R.libroID
    WHERE
        L.libroID = ?;    
    `,[id]);
        res.json( respuesta );
    } 

    public async searchBooks(req: Request, res: Response): Promise<void> {
        const { Identificador } = req.body;
        const respuesta = `
            SELECT
                Libros.libroID,
                Libros.titulo,
                Autores.nombre AS autor,
                Libros.descripcion
            FROM
                Libros
                LEFT JOIN AutoresLibros ON Libros.libroID = AutoresLibros.libroID
                LEFT JOIN Autores ON AutoresLibros.autorID = Autores.autorID
                LEFT JOIN LibrosGeneros ON Libros.libroID = LibrosGeneros.libroID
                LEFT JOIN Generos ON LibrosGeneros.generoID = Generos.generoID
            WHERE
                Libros.titulo LIKE ? OR Autores.nombre LIKE ?;
        `;
    
        const resp = await pool.query(respuesta, [`%${Identificador}%`, `%${Identificador}%`]);
    
        if (resp.length > 0) {
            res.json(resp);
        } else {
            res.status(403).json({ mensaje: 'Libro inexistente' });
        }
    }

    public async UpdateBooks(req: Request, res: Response): Promise<void> {
        const { Titulo, Autor, Descripcion, Genero, Formato, Enlace } = req.body;
        const { id } = req.params;
    
        try {
            const resp = await pool.query("UPDATE Libros SET titulo=?, descripcion=?, formato=?, enlace=? WHERE libroID = ?", [Titulo, Descripcion, Formato, Enlace, id]);
    
            const autores = await pool.query('SELECT autorID FROM Autores WHERE nombre = ?', [Autor]);
            const generos = await pool.query('SELECT generoID FROM Generos WHERE nombre = ?', [Genero]);
    
            if (autores.length > 0) {
                const actualizeAutorLibro = await pool.query(
                    'UPDATE AutoresLibros SET autorID=? WHERE libroID=?', [autores[0].autorID, id]);
            } else {
                const createAutor = await pool.query('INSERT INTO Autores (nombre) VALUES (?)', [Autor]);
                const actualizeAutorLibro = await pool.query(
                    'UPDATE AutoresLibros SET autorID=? WHERE libroID=?', [createAutor.insertId, id]);
            }
    
            if (generos.length > 0) {
                const actulizeGeneroLibro = await pool.query(
                    'UPDATE LibrosGeneros SET generoID=? WHERE libroID=?', [generos[0].generoID, id]);
            } else {
                const createGenero = await pool.query('INSERT INTO Generos (nombre) VALUES (?)', [Genero]);
                const actulizeGeneroLibro = await pool.query(
                    'UPDATE LibrosGeneros SET generoID=? WHERE libroID=?', [createGenero.insertId, id]);
            }
    
            res.json(resp);
        } catch (error) {
            console.error('Error al actualizar el libro:', error);
            res.status(500).json({ error: 'Error al actualizar el libro' });
        }
    }
    

    public async DeleteBooks(req: Request, res: Response): Promise<void> {
        const {id} = req.params;
        const respuesta = await pool.query("DELETE FROM Libros  WHERE libroID = ?", [id]);
        res.json(respuesta);
    }  

    public async readinglistBooks(req: Request, res: Response): Promise<void> {
        const {id} = req.params;
        const respuesta = await pool.query(`
        SELECT
            ListasLectura.listaID AS idlista,
            Libros.titulo AS titulolibro,
            Autores.nombre AS autor,
            Libros.descripcion
        FROM
            ListasLectura
            JOIN Libros ON ListasLectura.libroID = Libros.libroID
            JOIN AutoresLibros ON Libros.libroID = AutoresLibros.libroID
            JOIN Autores ON AutoresLibros.autorID = Autores.autorID
            JOIN Prestamos ON ListasLectura.libroID = Prestamos.libroID
        WHERE
            ListasLectura.usuarioID = ?
            AND Prestamos.estado = 'Devuelto';
    `, [id]);

        if(respuesta.length>0){
            res.json(respuesta);
            return ;
        }
        res.status(403).json({ mensaje: 'No existe lista de lectura' });
    } 
    
}
export const booksController = new BooksController();