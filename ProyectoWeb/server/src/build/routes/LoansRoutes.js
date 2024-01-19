"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const loansController_1 = require("../controllers/loansController");
const auth_1 = require("../middleware/auth");
class LoansRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.config();
    }
    config() {
        this.router.post('/createLoans/', auth_1.validarToken, loansController_1.loansController.createloans);
        this.router.get('/showpersonalLoans/:id', auth_1.validarToken, loansController_1.loansController.showpersonalLoans);
        this.router.put('/updateLoans/:id', auth_1.validarToken, loansController_1.loansController.Updateloans);
    }
}
const loansRoutes = new LoansRoutes();
exports.default = loansRoutes.router;
