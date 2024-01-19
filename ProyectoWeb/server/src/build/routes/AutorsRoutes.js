"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const AutorsController_1 = require("../controllers/AutorsController");
const auth_1 = require("../middleware/auth");
class AutorsRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.config();
    }
    config() {
        this.router.post('/createAutor/', auth_1.validarToken, AutorsController_1.autorsController.createAutors);
        this.router.get('/showAutors/', auth_1.validarToken, AutorsController_1.autorsController.showAutors);
        this.router.get('/editAutors/:id', auth_1.validarToken, AutorsController_1.autorsController.UpdateAutors);
        this.router.get('/deleteAutors/:id', AutorsController_1.autorsController.DeleteAutors);
    }
}
const autorsRoutes = new AutorsRoutes();
exports.default = autorsRoutes.router;
