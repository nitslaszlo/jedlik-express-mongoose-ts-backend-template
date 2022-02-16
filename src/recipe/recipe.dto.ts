import { IsOptional, IsInt, IsBoolean, IsDateString, IsNumber, IsNotEmpty, IsString, IsUrl } from "class-validator";

export default class CreateRecipeDto {
    @IsNotEmpty()
    @IsString()
    public recipeName: string; // 1pont

    @IsNotEmpty()
    @IsUrl()
    @IsString()
    public imageURL: string; // 1pont

    @IsNotEmpty()
    @IsString()
    public description: string; // 1pont

    @IsNotEmpty()
    @IsDateString()
    @IsOptional()
    public dateAdded: Date; // 1pont

    @IsNotEmpty()
    @IsBoolean()
    public isGlutenFree: boolean; // 1pont

    @IsNotEmpty()
    @IsNumber()
    public prepTime: number; // 1pont

    @IsNotEmpty()
    @IsInt()
    public easyOfPrep: number; // 1pont
}
