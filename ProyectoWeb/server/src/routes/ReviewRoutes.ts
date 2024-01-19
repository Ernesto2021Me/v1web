import { Router } from 'express';
import { reviewController} from '../controllers/ReviewController';
import { validarToken } from '../middleware/auth';
class ReviewRoutes
{
public router: Router=Router();
constructor()
{
this.config();
}
config() : void
{
 this.router.post('/createReview/',validarToken,reviewController.createReview);
 this.router.get('/showpersonalsReview/:id',validarToken,reviewController.showpersonalsreviews);
 this.router.put('/editdatesReview/:id',validarToken,reviewController.Updatereviews);
 this.router.delete('/deleteReviews/:id',validarToken,reviewController.Deletereviews);
}
}
const reviewRoutes= new ReviewRoutes();
export default reviewRoutes.router;