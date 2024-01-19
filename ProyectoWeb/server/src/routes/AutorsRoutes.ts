import { Router } from 'express';
import { autorsController} from '../controllers/AutorsController';
import { validarToken } from '../middleware/auth';
class AutorsRoutes
{
public router: Router=Router();
constructor()
{
this.config();
}
config() : void
{
   this.router.post('/createAutor/',validarToken,autorsController.createAutors);
   this.router.get('/showAutors/',validarToken,autorsController.showAutors);
   this.router.get('/editAutors/:id',validarToken,autorsController.UpdateAutors);
   this.router.get('/deleteAutors/:id',autorsController.DeleteAutors);
}
}
const autorsRoutes= new AutorsRoutes();
export default autorsRoutes.router;