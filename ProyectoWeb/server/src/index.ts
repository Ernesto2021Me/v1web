import express, {Application} from 'express';
import indexRoutes from './routes/indexRoutes';
import LoginRoutes from './routes/LoginRoutes';
import SettingsRoutes from './routes/SettingsRoutes'
import BooksRoutes from './routes/BooksRoutes';
import LoansRoutes from './routes/LoansRoutes';
import ReviewsRoutes from './routes/ReviewRoutes';
import AutorsRoutes from './routes/AutorsRoutes';
import GenersRoutes from './routes/GenersRoutes';
import administratorRoutes from './routes/AdministratorRoutes';
import swagger_ui_express from 'swagger-ui-express';
import swaggerDocument from './swagger.json';
import morgan from 'morgan';
import cors from 'cors';
import AdministratorRoutes from './routes/AdministratorRoutes';
;
class Server
{
public app: Application;
constructor()
{
this.app= express();
this.config();
this.routes();
this.app.use('/documentacion',swagger_ui_express.serve, swagger_ui_express.setup(swaggerDocument));
}
config (): void
{
    this.app.set('port',process.env.PORT|| 3000);
    this.app.use(morgan('dev'));
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(express.urlencoded({extended: false}));
}
routes (): void
{   this.app.use(indexRoutes);
    this.app.use('/api/Login',LoginRoutes);
    this.app.use('/api/Settings',SettingsRoutes);
    this.app.use('/api/Books',BooksRoutes);
    this.app.use('/api/Loans',LoansRoutes);
    this.app.use('/api/Reviews',ReviewsRoutes);
    //this.app.use('/api/Autors',AutorsRoutes);
    //this.app.use('/api/Geners',GenersRoutes);
    this.app.use('/api/Administrator',AdministratorRoutes);
}
start (): void
{
this.app.listen(this.app.get('port'), () =>
{
console.log('Server on port',this.app.get('port'));
});
}
}
const server = new Server();
server.start();