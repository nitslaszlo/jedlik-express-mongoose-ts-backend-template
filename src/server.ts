import { config } from "dotenv";
import App from "./app";
import UserController from "./user/user.controller";
import RecipeController from "./recipe/recipe.controller";
import validateEnv from "./utils/validateEnv";

config(); // Read and set variables from .env file.
validateEnv();

const app = new App([new UserController(), new RecipeController()]);

app.listen();
