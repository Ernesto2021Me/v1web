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
exports.administratorController = void 0;
const database_1 = __importDefault(require("../database"));
class AdministratorsController {
    createAdministrator(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const resp = yield database_1.default.query("INSERT INTO Usuarios set ?", [req.body]);
            if (resp.affectedRows > 0) {
                // Obtener el usuarioID actualizado
                const usuarioID = resp.insertId;
                const respuesta = yield database_1.default.query("INSERT INTO Administradores SET ?", [{ usuarioID }]);
                res.json(respuesta);
            }
        });
    }
    ValidateAdministrator(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { correoElectronico, contrasena } = req.body;
            const resp = yield database_1.default.query('SELECT U.*, IFNULL(A.usuarioID, 0) AS esAdministrador ' +
                'FROM Usuarios U ' +
                'LEFT JOIN Administradores A ON U.usuarioID = A.usuarioID ' +
                'WHERE U.correoElectronico = ? AND U.contrasena = ?', [correoElectronico, contrasena]);
            if (resp.length > 0) {
                res.status(200).json({ mensaje: 'Acceso concedido' });
            }
            else {
                res.status(403).json({ mensaje: 'Usuario inexistente' });
            }
        });
    }
    ShowUsers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const respuesta = yield database_1.default.query(`
        SELECT U.usuarioID,U.nombre,U.correoElectronico FROM Usuarios U INNER JOIN Administradores A ON U.usuarioID = A.usuarioID; `);
            res.json(respuesta);
        });
    }
    SearchUserpersonal(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const respuesta = yield database_1.default.query('SELECT A.AdminID,U.usuarioID, U.nombre, U.correoElectronico, U.contrasena ' +
                'FROM Usuarios U ' +
                'INNER JOIN Administradores A ON U.usuarioID = A.usuarioID ' +
                'WHERE U.usuarioID = ?', [id]);
            res.json(respuesta);
        });
    }
    UpdateAdministratos(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const respuesta = yield database_1.default.query("UPDATE Usuarios set ? WHERE usuarioID = ?", [req.body, id]);
            res.json(respuesta);
        });
    }
    DeleteAdministrators(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const respuesta = yield database_1.default.query("DELETE FROM Usuarios WHERE usuarioID = ?", [id]);
            res.json(respuesta);
        });
    }
}
exports.administratorController = new AdministratorsController();
