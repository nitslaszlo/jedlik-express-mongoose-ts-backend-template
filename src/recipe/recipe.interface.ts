export default interface IRecipe {
    _id: number;
    author: number;
    recipeName: string;
    imageURL: string;
    description: string;
    dateAdded: Date;
    isGlutenFree: boolean;
    prepTime: number;
    easyOfPrep: number;
}
