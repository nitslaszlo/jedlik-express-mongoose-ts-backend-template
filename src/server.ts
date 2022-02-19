import App from "./app";
import RecipeController from "./recipe/recipe.controller";

const app = new App([new RecipeController()]);

app.listen();
