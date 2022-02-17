import { config } from "dotenv";
import App from "./app";
import RecipeController from "./recipe/recipe.controller";
import validateEnv from "./utils/validateEnv";

config(); // Read and set variables from .env file.
validateEnv();

const app = new App([new RecipeController()]);

app.listen();
