import "dotenv/config";
import App from "../../app";
import RecipeController from "../../recipe/recipe.controller";
import validateEnv from "../../utils/validateEnv";
import * as request from "supertest";
import IRecipe from "../../recipe/recipe.interface";

validateEnv();

let server: Express.Application;

beforeAll(async () => {
    server = new App([new RecipeController()]).getServer();
});

describe("test recipes endpoints", () => {
    // let id: string;
    // let count: number;

    it("GET /recipes", async () => {
        const response = await request(server).get("/recipes");
        const recipes: IRecipe[] = response.body;
        expect(response.statusCode).toEqual(200);
        expect(recipes.length).toEqual(10);
        expect(recipes[0].recipeName).toEqual("VILÁGBAJNOK GÖNGYÖLT CSIRKEMELL");
    });

    it("GET /recipes (search for 'keyword')", async () => {
        const response = await request(server).get("/recipes/paradicsom/recipeName/ASC");
        const recipes: IRecipe[] = response.body;
        expect(response.statusCode).toEqual(200);
        expect(recipes.length).toEqual(2);
        expect(recipes[0].recipeName).toEqual("PENNE ALL ARRABBIATA CSIRKEMELLEL");
    });

    // it("GET /recipes (search for wrong 'keyword')", async () => {
    //     const response = await request(server).get("/recipes/goesiéhgesouihg/recipeName/ASC").set("Cookie", cookie);
    //     expect(response.statusCode).toEqual(200);
    //     expect(response.body.count).toEqual(0);
    // });

    // it("GET /recipes/:id  (wrong id)", async () => {
    //     id = "uogawagfhianwoigaahnwg";
    //     const response = await request(server).get(`/recipes/${id}`).set("Cookie", cookie);
    //     expect(response.statusCode).toEqual(404);
    //     expect(response.body.message).toEqual(`This ${id} id is not valid.`);
    // });

    // it("DELETE /recipes/:id  (wrong id)", async () => {
    //     const response = await request(server).delete(`/recipes/${id}`).set("Cookie", cookie);
    //     expect(response.statusCode).toEqual(404);
    //     expect(response.body.message).toEqual(`This ${id} id is not valid.`);
    // });

    // it("PATCH /recipes/:id  (wrong id)", async () => {
    //     const response = await request(server).patch(`/recipes/${id}`).set("Cookie", cookie);
    //     expect(response.statusCode).toEqual(404);
    //     expect(response.body.message).toEqual(`This ${id} id is not valid.`);
    // });

    // it("POST /recipes (empty)", async () => {
    //     const response = await request(server).post("/recipes").set("Cookie", cookie);
    //     expect(response.statusCode).toEqual(400);
    //     expect(response.body.message).toEqual("recipeName must be a string,recipeName should not be empty, imageURL must be a string,imageURL must be an URL address,imageURL should not be empty, description must be a string,description should not be empty, ingredients should not be empty,ingredients must be an array");
    // });

    // it("POST /recipes", async () => {
    //     const response = await request(server)
    //         .post("/recipes")
    //         .set("Cookie", cookie)
    //         .send({
    //             recipeName: "Mock recipe by Ányos",
    //             imageURL: "https://jedlik.eu/images/Jedlik-logo-2020-200.png",
    //             description: "I'll be deleted soon",
    //             ingredients: ["asa", "sas"],
    //         });
    //     id = response.body._id;
    //     expect(response.statusCode).toEqual(200);
    // });

    // it("PATCH /recipes/:id", async () => {
    //     const response = await request(server).patch(`/recipes/${id}`).set("Cookie", cookie).send({
    //         recipeName: "asdasd",
    //     });
    //     expect(response.statusCode).toEqual(200);
    // });

    // it("DELETE /recipes/:id", async () => {
    //     const response = await request(server).delete(`/recipes/${id}`).set("Cookie", cookie);
    //     expect(response.statusCode).toEqual(200);
    // });
});
