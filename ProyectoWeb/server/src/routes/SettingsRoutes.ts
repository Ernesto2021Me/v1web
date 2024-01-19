import { Router } from 'express';
import { usersController } from '../controllers/UsersController';
import { administratorController } from '../controllers/AdministratorsController';
import { validarToken } from '../middleware/auth';
class ConfigurationRoutes
{
public router: Router=Router();
constructor()
{
this.config();
}
config() : void
{
 this.router.get('/showUserdata/:id',validarToken,usersController.SearchUserpersonal);
 this.router.put('/editUserdata/:id',validarToken,usersController.UpdateUsers);
 this.router.delete('/deleteUserdata/:id',validarToken,usersController.DeleteUsers);
 this.router.post('/createAdministrator/',validarToken,administratorController.createAdministrator);
 this.router.get('/showAdministratordata/:id',validarToken,administratorController.SearchUserpersonal);
 this.router.put('/editAdministratordata/:id',validarToken,administratorController.UpdateAdministratos);
 this.router.delete('/deleteAdministrator/:id',validarToken,administratorController.DeleteAdministrators);
 
}
}
const configurationRoutes= new ConfigurationRoutes();
export default configurationRoutes.router;