"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const BooksController_1 = require("../controllers/BooksController");
const auth_1 = require("../middleware/auth");
class BooksRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.config();
    }
    config() {
        this.router.get('/showBookspopular/', auth_1.validarToken, BooksController_1.booksController.showBookspopular);
        this.router.get('/showBooksrecomend/:id', auth_1.validarToken, BooksController_1.booksController.showBooksrecomend);
        this.router.get('/showBookdetails/:id', auth_1.validarToken, BooksController_1.booksController.showBookdetails);
        this.router.post('/searchBooks/', auth_1.validarToken, BooksController_1.booksController.searchBooks);
        this.router.get('/showBooks/', auth_1.validarToken, BooksController_1.booksController.showBooks);
        this, this.router.get('/showreadlistBooks/:id', auth_1.validarToken, BooksController_1.booksController.readinglistBooks);
    }
}
const booksRoutes = new BooksRoutes();
exports.default = booksRoutes.router;
