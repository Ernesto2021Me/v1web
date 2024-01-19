"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const UsersController_1 = require("../controllers/UsersController");
const AdministratorsController_1 = require("../controllers/AdministratorsController");
const auth_1 = require("../middleware/auth");
class LoginRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.config();
    }
    config() {
        this.router.post('/createUser/', auth_1.validarToken, UsersController_1.usersController.createUser);
        this.router.post('/createAdministrator/', auth_1.validarToken, AdministratorsController_1.administratorController.createAdministrator);
        this.router.post('/validateUser/', auth_1.validarToken, UsersController_1.usersController.ValidateUsers);
        this.router.post('/validateAdministrator/', auth_1.validarToken, AdministratorsController_1.administratorController.ValidateAdministrator);
    }
}
const loginRoutes = new LoginRoutes();
exports.default = loginRoutes.router;
