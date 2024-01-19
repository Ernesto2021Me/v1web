import { Router } from 'express';
import { usersController } from '../controllers/UsersController';
import { administratorController } from '../controllers/AdministratorsController';
import { validarToken } from '../middleware/auth';

class LoginRoutes
{
public router: Router=Router();
constructor()
{
this.config();
}
config() : void
{
    this.router.post('/createUser/',validarToken,usersController.createUser);
    this.router.post('/createAdministrator/',validarToken,administratorController.createAdministrator);
    this.router.post('/validateUser/',validarToken,usersController.ValidateUsers);
    this.router.post('/validateAdministrator/',validarToken,administratorController.ValidateAdministrator);
}
}
const loginRoutes= new LoginRoutes();
export default loginRoutes.router;