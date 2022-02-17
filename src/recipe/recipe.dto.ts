import { MinLength, MaxLength, IsOptional, IsInt, IsBoolean, IsDateString, IsNumber, IsNotEmpty, IsString, IsUrl } from "class-validator";
// class-validator: https://github.com/typestack/class-validator
export default class RecipeDto {
    @IsNotEmpty()
    @IsString()
    @MinLength(10, {
        message: "Name is too short",
    })
    @MaxLength(50, {
        message: "Name is too long",
    })
    public recipeName: string;

    @IsNotEmpty()
    @IsUrl()
    @IsString()
    public imageURL: string;

    @IsNotEmpty()
    @IsString()
    public description: string;

    @IsNotEmpty()
    @IsDateString()
    @IsOptional()
    public dateAdded: Date;

    @IsNotEmpty()
    @IsBoolean()
    public isGlutenFree: boolean;

    @IsNotEmpty()
    @IsNumber()
    public prepTime: number;

    @IsNotEmpty()
    @IsInt()
    public easyOfPrep: number;
}
