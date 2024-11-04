export default class CreateUserDto {
  public email!: string;
  public avatar?: string;
  public name!: string;
  public userType!: string;
  public password!: string;
}
