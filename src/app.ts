// import * as cookieParser from "cookie-parser";
import * as express from "express";
import * as mongoose from "mongoose";
import IController from "./interfaces/controller.interface";
import errorMiddleware from "./middleware/error.middleware";
import loggerMiddleware from "./middleware/logger.middleware";
import userModel from "./user/user.model";

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
        this.app.listen(5000, () => {
            console.log(`App listening on the port 5000`);
        });
    }

    public getServer(): express.Application {
        return this.app;
    }

    private initializeMiddlewares() {
        this.app.use(express.json());
        // this.app.use(cookieParser());
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
        // Connect MongoDB Atlas
        // mongoose.connect("mongodb+srv://m001-student:m001-student@sandbox.3fiqf.mongodb.net/VizsgaBackend?retryWrites=true&w=majority");

        // Connect to localhost
        mongoose.connect(`mongodb://localhost:27017/VizsgaBackend`);

        userModel.init();
    }
}
