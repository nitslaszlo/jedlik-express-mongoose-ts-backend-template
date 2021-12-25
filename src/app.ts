import * as favicon from "serve-favicon";
import * as path from "path";
import * as cookieParser from "cookie-parser";
import * as express from "express";
import * as mongoose from "mongoose";
import Controller from "./interfaces/controller.interface";
import errorMiddleware from "./middleware/error.middleware";
import loggerMiddleware from "./middleware/logger.middleware";

export default class App {
    public app: express.Application;

    constructor(controllers: Controller[]) {
        this.app = express();
        this.connectToTheDatabase();
        this.initializeMiddlewares();
        this.initializeControllers(controllers);
        this.initializeErrorHandling();
    }

    public listen(): void {
        this.app.listen(process.env.PORT, () => {
            console.log(`App listening on the port ${process.env.PORT}`);
        });
    }

    public getServer(): express.Application {
        return this.app;
    }

    private initializeMiddlewares() {
        try {
            this.app.use(favicon(path.join(__dirname, "../favicon.ico")));
        } catch (error) {
            console.log(error.message);
        }
        this.app.use(express.json());
        this.app.use(cookieParser());
        // Enabled CORS:
        this.app.use((req, res, next) => {
            res.header("Access-Control-Allow-Origin", "*");
            // res.header("Access-Control-Allow-Origin", "http://localhost:8080");
            // Ha "Access-Control-Allow-Credentials", "true", akkor az origin nem lehet "*"!
            // res.header("Access-Control-Allow-Credentials", "true");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
            res.header("Set-Cookie", "HttpOnly;Secure;SameSite=None");
            if (req.method === "OPTIONS") {
                res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
                return res.status(200).json({});
            }
            // if (req.method === "OPTIONS") {
            //     res.setHeader("Access-Control-Allow-Methods", "POST, PUT, PATCH, GET, DELETE");
            //     return res.status(200).json({});
            // }
            next();
        });
        this.app.use(loggerMiddleware);
    }

    private initializeErrorHandling() {
        this.app.use(errorMiddleware);
    }

    private initializeControllers(controllers: Controller[]) {
        controllers.forEach(controller => {
            this.app.use("/", controller.router);
        });
    }

    private connectToTheDatabase() {
        const { MONGO_USER, MONGO_PASSWORD, MONGO_PATH, MONGO_DB } = process.env;
        mongoose.connect(`mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}${MONGO_PATH}${MONGO_DB}?retryWrites=true&w=majority`);
    }
}
