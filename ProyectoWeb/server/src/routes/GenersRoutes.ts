import { Router } from 'express';
import { generosController} from '../controllers/GenerosController';
class GenersRoutes
{
public router: Router=Router();
constructor()
{
this.config();
}
config() : void
{
   this.router.post('/createGener/',generosController.createGeners);
   this.router.get('/showGeners/',generosController.showGeners);
   this.router.get('/editGeners/:id',generosController.UpdateGeners);
   this.router.get('/deleteGeners/:id',generosController.DeleteGeners);
}
}
const genersRoutes= new GenersRoutes();
export default genersRoutes.router;