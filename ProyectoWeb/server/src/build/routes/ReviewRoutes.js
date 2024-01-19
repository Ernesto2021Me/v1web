"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ReviewController_1 = require("../controllers/ReviewController");
const auth_1 = require("../middleware/auth");
class ReviewRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.config();
    }
    config() {
        this.router.post('/createReview/', auth_1.validarToken, ReviewController_1.reviewController.createReview);
        this.router.get('/showpersonalsReview/:id', auth_1.validarToken, ReviewController_1.reviewController.showpersonalsreviews);
        this.router.put('/editdatesReview/:id', auth_1.validarToken, ReviewController_1.reviewController.Updatereviews);
        this.router.delete('/deleteReviews/:id', auth_1.validarToken, ReviewController_1.reviewController.Deletereviews);
    }
}
const reviewRoutes = new ReviewRoutes();
exports.default = reviewRoutes.router;
