/* eslint-disable @typescript-eslint/no-unused-vars */
import { IsOptional, IsString, IsBoolean, ValidateNested } from "class-validator";
import CreateAddressDto from "./address.dto";

export default class CreateUserDto {
    @IsString()
    public name: string;

    @IsString()
    public email: string;

    @IsBoolean()
    public email_verifed: boolean;

    @IsString()
    public picture: string;

    @IsString()
    public password: string;

    @IsOptional()
    @ValidateNested()
    public address?: CreateAddressDto;
}
