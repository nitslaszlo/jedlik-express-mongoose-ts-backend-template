/* eslint-disable @typescript-eslint/no-unused-vars */
import { IsOptional, IsString, IsBoolean, ValidateNested, IsInt } from "class-validator";
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

    @IsInt()
    public role_bits: number;

    @IsOptional()
    @ValidateNested()
    public address?: CreateAddressDto;
}
