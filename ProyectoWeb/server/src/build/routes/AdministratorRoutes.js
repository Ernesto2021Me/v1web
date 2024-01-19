"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const UsersController_1 = require("../controllers/UsersController");
const ReviewController_1 = require("../controllers/ReviewController");
const loansController_1 = require("../controllers/loansController");
const BooksController_1 = require("../controllers/BooksController");
const auth_1 = require("../middleware/auth");
const GenerosController_1 = require("../controllers/GenerosController");
const AutorsController_1 = require("../controllers/AutorsController");
class AdministratorsRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.config();
    }
    config() {
        this.router.get('/showUsers/', auth_1.validarToken, UsersController_1.usersController.ShowUsers);
        this.router.get('/showpersonalsReview/:id', auth_1.validarToken, ReviewController_1.reviewController.showpersonalsreviews);
        this.router.get('/showLoans/:id', auth_1.validarToken, loansController_1.loansController.showLoans);
        this.router.delete('/deleteUserdata/:id', auth_1.validarToken, UsersController_1.usersController.DeleteUsers);
        this.router.get('/showpersonalsReview/:id', auth_1.validarToken, ReviewController_1.reviewController.showpersonalsreviews);
        this.router.post('/createBook/', auth_1.validarToken, BooksController_1.booksController.createBooks);
        this.router.get('/showBooks/', auth_1.validarToken, BooksController_1.booksController.showBooks);
        this.router.post('/searchBooks/', auth_1.validarToken, BooksController_1.booksController.searchBooks);
        this.router.put('/editBooksdates/:id', auth_1.validarToken, BooksController_1.booksController.UpdateBooks);
        this.router.delete('/deleteBooksdates/:id', auth_1.validarToken, BooksController_1.booksController.DeleteBooks);
        this.router.post('/createGener/', auth_1.validarToken, GenerosController_1.generosController.createGeners);
        this.router.get('/showGeners/', auth_1.validarToken, GenerosController_1.generosController.showGeners);
        this.router.put('/editGeners/:id', auth_1.validarToken, GenerosController_1.generosController.UpdateGeners);
        this.router.delete('/deleteGeners/:id', auth_1.validarToken, GenerosController_1.generosController.DeleteGeners);
        this.router.post('/createAutor/', auth_1.validarToken, AutorsController_1.autorsController.createAutors);
        this.router.get('/showAutors/', auth_1.validarToken, AutorsController_1.autorsController.showAutors);
        this.router.put('/editAutors/:id', auth_1.validarToken, AutorsController_1.autorsController.UpdateAutors);
        this.router.delete('/deleteAutors/:id', auth_1.validarToken, AutorsController_1.autorsController.DeleteAutors);
    }
}
const administratorsRoutes = new AdministratorsRoutes();
exports.default = administratorsRoutes.router;
