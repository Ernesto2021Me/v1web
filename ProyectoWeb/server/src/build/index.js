"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const indexRoutes_1 = __importDefault(require("./routes/indexRoutes"));
const LoginRoutes_1 = __importDefault(require("./routes/LoginRoutes"));
const SettingsRoutes_1 = __importDefault(require("./routes/SettingsRoutes"));
const BooksRoutes_1 = __importDefault(require("./routes/BooksRoutes"));
const LoansRoutes_1 = __importDefault(require("./routes/LoansRoutes"));
const ReviewRoutes_1 = __importDefault(require("./routes/ReviewRoutes"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_json_1 = __importDefault(require("./swagger.json"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const AdministratorRoutes_1 = __importDefault(require("./routes/AdministratorRoutes"));
;
class Server {
    constructor() {
        this.app = (0, express_1.default)();
        this.config();
        this.routes();
        this.app.use('/documentacion', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_json_1.default));
    }
    config() {
        this.app.set('port', process.env.PORT || 3000);
        this.app.use((0, morgan_1.default)('dev'));
        this.app.use((0, cors_1.default)());
        this.app.use(express_1.default.json());
        this.app.use(express_1.default.urlencoded({ extended: false }));
    }
    routes() {
        this.app.use(indexRoutes_1.default);
        this.app.use('/api/Login', LoginRoutes_1.default);
        this.app.use('/api/Settings', SettingsRoutes_1.default);
        this.app.use('/api/Books', BooksRoutes_1.default);
        this.app.use('/api/Loans', LoansRoutes_1.default);
        this.app.use('/api/Reviews', ReviewRoutes_1.default);
        //this.app.use('/api/Autors',AutorsRoutes);
        //this.app.use('/api/Geners',GenersRoutes);
        this.app.use('/api/Administrator', AdministratorRoutes_1.default);
    }
    start() {
        this.app.listen(this.app.get('port'), () => {
            console.log('Server on port', this.app.get('port'));
        });
    }
}
const server = new Server();
server.start();
