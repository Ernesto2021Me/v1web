"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const GenerosController_1 = require("../controllers/GenerosController");
class GenersRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.config();
    }
    config() {
        this.router.post('/createGener/', GenerosController_1.generosController.createGeners);
        this.router.get('/showGeners/', GenerosController_1.generosController.showGeners);
        this.router.get('/editGeners/:id', GenerosController_1.generosController.UpdateGeners);
        this.router.get('/deleteGeners/:id', GenerosController_1.generosController.DeleteGeners);
    }
}
const genersRoutes = new GenersRoutes();
exports.default = genersRoutes.router;
