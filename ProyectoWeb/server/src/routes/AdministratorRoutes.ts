import { Router } from 'express';
import { usersController } from '../controllers/UsersController';
import { administratorController } from '../controllers/AdministratorsController';
import { reviewController} from '../controllers/ReviewController';
import { loansController} from '../controllers/loansController';
import { booksController } from '../controllers/BooksController';
import { validarToken } from '../middleware/auth';
import { generosController} from '../controllers/GenerosController';
import { autorsController} from '../controllers/AutorsController';
class AdministratorsRoutes
{
public router: Router=Router();
constructor()
{
this.config();
}
config() : void
{
 this.router.get('/showUsers/',validarToken,usersController.ShowUsers);
 this.router.get('/showpersonalsReview/:id',validarToken,reviewController.showpersonalsreviews);
 this.router.get('/showLoans/:id',validarToken,loansController.showLoans);
 this.router.delete('/deleteUserdata/:id',validarToken,usersController.DeleteUsers);
 this.router.get('/showpersonalsReview/:id',validarToken,reviewController.showpersonalsreviews);
 this.router.post('/createBook/', validarToken, booksController.createBooks);
 this.router.get('/showBooks/', validarToken, booksController.showBooks);
 this.router.post('/searchBooks/', validarToken, booksController.searchBooks);
 this.router.put('/editBooksdates/:id', validarToken, booksController.UpdateBooks);
 this.router.delete('/deleteBooksdates/:id', validarToken, booksController.DeleteBooks);
 this.router.post('/createGener/',validarToken,generosController.createGeners);
 this.router.get('/showGeners/',validarToken,generosController.showGeners);
 this.router.put('/editGeners/:id',validarToken,generosController.UpdateGeners);
 this.router.delete('/deleteGeners/:id',validarToken,generosController.DeleteGeners);
 this.router.post('/createAutor/',validarToken,autorsController.createAutors);
 this.router.get('/showAutors/',validarToken,autorsController.showAutors);
 this.router.put('/editAutors/:id',validarToken,autorsController.UpdateAutors);
 this.router.delete('/deleteAutors/:id',validarToken,autorsController.DeleteAutors);
 
}
}
const administratorsRoutes= new AdministratorsRoutes();
export default administratorsRoutes.router;