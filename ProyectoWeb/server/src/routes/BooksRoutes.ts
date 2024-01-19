import { Router } from 'express';
import { booksController } from '../controllers/BooksController';
import { validarToken } from '../middleware/auth';

class BooksRoutes {
  public router: Router = Router();
  constructor() {
    this.config();
  }
  config(): void {
    this.router.get('/showBookspopular/', validarToken, booksController.showBookspopular);
    this.router.get('/showBooksrecomend/:id', validarToken, booksController.showBooksrecomend);
    this.router.get('/showBookdetails/:id', validarToken, booksController.showBookdetails);
    this.router.post('/searchBooks/', validarToken, booksController.searchBooks);
    this.router.get('/showBooks/', validarToken, booksController.showBooks);
    this, this.router.get('/showreadlistBooks/:id', validarToken, booksController.readinglistBooks)
  }
}
const booksRoutes = new BooksRoutes();
export default booksRoutes.router;