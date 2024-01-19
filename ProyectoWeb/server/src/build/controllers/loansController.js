"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loansController = void 0;
const database_1 = __importDefault(require("../database"));
class LoansController {
    createloans(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { Nombre, Titulo } = req.body;
            try {
                // Obtener libroID
                const libroResult = yield database_1.default.query('SELECT libroID FROM Libros WHERE titulo = ?', [Titulo]);
                if (libroResult.length === 0 || !libroResult[0].libroID) {
                    res.status(404).json({ error: 'Libro no encontrado' });
                    return;
                }
                const libroID = libroResult[0].libroID;
                // Obtener usuarioID
                const usuarioResult = yield database_1.default.query('SELECT usuarioID FROM Usuarios WHERE nombre = ?', [Nombre]);
                if (usuarioResult.length === 0 || !usuarioResult[0].usuarioID) {
                    res.status(404).json({ error: 'Usuario no encontrado' });
                    return;
                }
                const usuarioID = usuarioResult[0].usuarioID;
                // Insertar préstamo
                const resp = yield database_1.default.query("INSERT INTO Prestamos (usuarioID, libroID) VALUES (?, ?);", [usuarioID, libroID]);
                res.json(resp);
            }
            catch (error) {
                console.error('Error al crear préstamo:', error);
                res.status(500).json({ error: 'Error interno del servidor' });
            }
        });
    }
    showpersonalLoans(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const prestamosexpirados = yield database_1.default.query(`SELECT prestamoID, libroID FROM Prestamos
            WHERE estado = 'No Devuelto' AND DATEDIFF(fechaRecibo, CURRENT_DATE()) <= 0 
              AND usuarioID =  ?`, [id]);
            if (prestamosexpirados.length > 0) {
                for (const prestamo of prestamosexpirados) {
                    const prestamoID = prestamo.prestamoID;
                    // Paso 2: Cambiar el estado a 'Devuelto'
                    yield database_1.default.query('UPDATE Prestamos SET estado = "Devuelto" WHERE prestamoID = ?', [prestamoID]);
                    // Paso 3: Insertar en la lista de lectura
                    yield database_1.default.query('INSERT INTO ListasLectura (usuarioID, libroID) VALUES (?, ?)', [id, prestamo.libroID]);
                }
            }
            const respuesta = yield database_1.default.query(`SELECT P.prestamoID, L.titulo, L.descripcion, G.nombre AS genero, L.enlace,DATEDIFF(P.fechaRecibo, CURRENT_DATE()) AS tiempo_disponible 
            FROM Prestamos P 
            JOIN Libros L ON P.libroID = L.libroID 
            JOIN LibrosGeneros LG ON L.libroID = LG.libroID 
            JOIN Generos G ON LG.generoID = G.generoID 
            WHERE P.estado = 'No Devuelto' AND P.usuarioID = ?`, [id]);
            if (respuesta.length > 0) {
                res.json(respuesta);
                return;
            }
            res.status(403).json({ 'mensaje': 'No existen prestamos' });
        });
    }
    showLoans(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const prestamosexpirados = yield database_1.default.query(`SELECT prestamoID, libroID FROM Prestamos
            WHERE estado = 'No Devuelto' AND DATEDIFF(fechaRecibo, fechaExpedicion) <= 0
              AND usuarioID =  ?`, [id]);
            if (prestamosexpirados.length > 0) {
                for (const prestamo of prestamosexpirados) {
                    const prestamoID = prestamo.prestamoID;
                    // Paso 2: Cambiar el estado a 'Devuelto'
                    yield database_1.default.query('UPDATE Prestamos SET estado = "Devuelto" WHERE prestamoID = ?', [prestamoID]);
                    // Paso 3: Insertar en la lista de lectura
                    yield database_1.default.query('INSERT INTO ListasLectura (usuarioID, libroID) VALUES (?, ?)', [id, prestamo.libroID]);
                }
            }
            const respuesta = yield database_1.default.query(`SELECT P.prestamoID, L.titulo, L.descripcion, G.nombre AS genero, L.enlace, P.estado 
            FROM Prestamos P JOIN Libros L ON P.libroID = L.libroID 
            JOIN LibrosGeneros LG ON L.libroID = LG.libroID 
            JOIN Generos G ON LG.generoID = G.generoID WHERE P.usuarioID =?;`, [id]);
            if (respuesta.length > 0) {
                res.json(respuesta);
                return;
            }
            res.status(403).json({ 'mensaje': 'No existen prestamos' });
        });
    }
    Updateloans(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const resp = yield database_1.default.query("UPDATE Prestamos SET Estado = 'Devuelto' WHERE prestamoID =?", [id]);
            res.json(resp);
        });
    }
}
exports.loansController = new LoansController();
