import {IsEmail, IsString, Length} from 'class-validator';
import {CreateUserMessages} from './create-user.messages.js';

export default class CreateUserDto {
  @IsEmail({}, {message: CreateUserMessages.email.invalidFormat})
  public email!: string;

  @IsString({message: CreateUserMessages.avatarPath.invalidFormat})
  public avatar?: string;

  @IsString({message: CreateUserMessages.name.invalidFormat})
  @Length(1, 15, {message: CreateUserMessages.name.lengthField})
  public name!: string;

  @IsString({message: CreateUserMessages.userType.invalidFormat})
  public userType!: string;

  @IsString({message: CreateUserMessages.password.invalidFormat})
  @Length(6, 12, {message: CreateUserMessages.password.lengthField})
  public password!: string;
}
