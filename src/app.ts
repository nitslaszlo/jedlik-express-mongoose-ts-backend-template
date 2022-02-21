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
        this.app.use(express.json());
        this.app.use(loggerMiddleware);
        controllers.forEach(controller => {
            this.app.use("/", controller.router);
        });
        this.app.use(errorMiddleware);
    }

    public listen(): void {
        this.app.listen(5000, () => {
            console.log(`App listening on the port 5000`);
        });
    }

    private connectToTheDatabase() {
        // Connect to MongoDB Atlas:
        // mongoose.connect("mongodb+srv://m001-student:m001-student@sandbox.3fiqf.mongodb.net/VizsgaBackend?retryWrites=true&w=majority");

        // Connect to localhost:
        mongoose.connect(`mongodb://localhost:27017/VizsgaBackend`);

        userModel.init(); // for populate
    }
}
