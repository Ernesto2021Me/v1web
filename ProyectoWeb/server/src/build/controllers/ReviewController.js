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
exports.reviewController = void 0;
const database_1 = __importDefault(require("../database"));
class ReviewController {
    createReview(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { nombre, titulo, calificacion, comentario } = req.body;
            try {
                // Obtener usuarioID
                const usuarioResult = yield database_1.default.query('SELECT usuarioID FROM Usuarios WHERE nombre = ?', [nombre]);
                if (!usuarioResult || !usuarioResult[0] || !usuarioResult[0].usuarioID) {
                    res.status(404).json({ error: 'Usuario no encontrado' });
                    return;
                }
                const usuarioID = usuarioResult[0].usuarioID;
                // Obtener libroID
                const libroResult = yield database_1.default.query('SELECT libroID FROM Libros WHERE titulo = ?', [titulo]);
                if (!libroResult || !libroResult[0] || !libroResult[0].libroID) {
                    res.status(404).json({ error: 'Libro no encontrado' });
                    return;
                }
                const libroID = libroResult[0].libroID;
                // Insertar la nueva reseña
                const resp = yield database_1.default.query('INSERT INTO Reseñas (usuarioID, libroID, calificacion, comentario) VALUES (?, ?, ?, ?)', [usuarioID, libroID, calificacion, comentario]);
                res.json(resp);
            }
            catch (error) {
                console.error('Error al crear la reseña:', error);
                res.status(500).json({ error: 'Error interno del servidor' });
            }
        });
    }
    showpersonalsreviews(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const respuesta = yield database_1.default.query(' SELECT R.resenaID, L.titulo, R.calificacion, R.comentario FROM Reseñas R JOIN Libros L ON R.libroID = L.libroID WHERE R.usuarioID =?;', [id]);
            if (respuesta.length > 0) {
                res.json(respuesta);
                return;
            }
            res.status(403).json({ mensaje: 'No existen reseñas' });
        });
    }
    Updatereviews(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const respuesta = yield database_1.default.query("UPDATE Reseñas set ? WHERE resenaID = ?", [req.body, id]);
            res.json(respuesta);
        });
    }
    Deletereviews(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const resp = yield database_1.default.query(`DELETE FROM Reseñas WHERE resenaID = ${id}`);
            res.json(resp);
        });
    }
}
exports.reviewController = new ReviewController();
