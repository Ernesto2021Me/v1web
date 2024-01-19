"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const UsersController_1 = require("../controllers/UsersController");
const AdministratorsController_1 = require("../controllers/AdministratorsController");
const auth_1 = require("../middleware/auth");
class ConfigurationRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.config();
    }
    config() {
        this.router.get('/showUserdata/:id', auth_1.validarToken, UsersController_1.usersController.SearchUserpersonal);
        this.router.put('/editUserdata/:id', auth_1.validarToken, UsersController_1.usersController.UpdateUsers);
        this.router.delete('/deleteUserdata/:id', auth_1.validarToken, UsersController_1.usersController.DeleteUsers);
        this.router.post('/createAdministrator/', auth_1.validarToken, AdministratorsController_1.administratorController.createAdministrator);
        this.router.get('/showAdministratordata/:id', auth_1.validarToken, AdministratorsController_1.administratorController.SearchUserpersonal);
        this.router.put('/editAdministratordata/:id', auth_1.validarToken, AdministratorsController_1.administratorController.UpdateAdministratos);
        this.router.delete('/deleteAdministrator/:id', auth_1.validarToken, AdministratorsController_1.administratorController.DeleteAdministrators);
    }
}
const configurationRoutes = new ConfigurationRoutes();
exports.default = configurationRoutes.router;
