import * as cookieParser from "cookie-parser";
import * as express from "express";
import * as mongoose from "mongoose";
import * as cors from "cors";
import IController from "./interfaces/controller.interface";
import errorMiddleware from "./middleware/error.middleware";
import loggerMiddleware from "./middleware/logger.middleware";

export default class App {
    public app: express.Application;

    constructor(controllers: IController[]) {
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
        this.app.use(express.json());
        this.app.use(cookieParser());
        // Enabled CORS:
        this.app.use(
            cors({
                origin: ["https://jedlik-vite-template.netlify.app", "https://jedlik-vite-ts-template.netlify.app", "http://localhost:8080"],
                credentials: true,
                exposedHeaders: ["set-cookie"],
            }),
        );
        this.app.use(loggerMiddleware);
    }

    private initializeErrorHandling() {
        this.app.use(errorMiddleware);
    }

    private initializeControllers(controllers: IController[]) {
        controllers.forEach(controller => {
            this.app.use("/", controller.router);
        });
    }

    private connectToTheDatabase() {
        const { MONGO_USER, MONGO_PASSWORD, MONGO_PATH, MONGO_DB } = process.env;
        mongoose.connect(`mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}${MONGO_PATH}${MONGO_DB}?retryWrites=true&w=majority`);
        // mongoose.connect(`mongodb://localhost:27017/${MONGO_DB}`);
    }
}
