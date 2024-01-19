import { Router } from 'express';
import { loansController} from '../controllers/loansController';
import { validarToken } from '../middleware/auth';
class LoansRoutes
{
public router: Router=Router();
constructor()
{
this.config();
}
config() : void
{
   this.router.post('/createLoans/',validarToken,loansController.createloans);
   this.router.get('/showpersonalLoans/:id',validarToken,loansController.showpersonalLoans);
   this.router.put('/updateLoans/:id',validarToken,loansController.Updateloans);
}
}
const loansRoutes= new LoansRoutes();
export default loansRoutes.router;