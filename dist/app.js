import * as cookieParser from "cookie-parser";
import * as express from "express";
import * as mongoose from "mongoose";
import errorMiddleware from "./middleware/error.middleware";
import loggerMiddleware from "./middleware/logger.middleware";
export default class App {
    app;
    constructor(controllers) {
        this.app = express();
        this.connectToTheDatabase();
        this.initializeMiddlewares();
        this.initializeControllers(controllers);
        this.initializeErrorHandling();
    }
    listen() {
        this.app.listen(process.env.PORT, () => {
            console.log(`App listening on the port ${process.env.PORT}`);
        });
    }
    getServer() {
        return this.app;
    }
    initializeMiddlewares() {
        this.app.use(express.json());
        this.app.use(cookieParser());
        this.app.use(loggerMiddleware);
    }
    initializeErrorHandling() {
        this.app.use(errorMiddleware);
    }
    initializeControllers(controllers) {
        controllers.forEach(controller => {
            this.app.use("/", controller.router);
        });
    }
    connectToTheDatabase() {
        const { MONGO_USER, MONGO_PASSWORD, MONGO_PATH, MONGO_DB } = process.env;
        mongoose.connect(`mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}${MONGO_PATH}${MONGO_DB}?retryWrites=true&w=majority`);
    }
}
//# sourceMappingURL=app.js.map