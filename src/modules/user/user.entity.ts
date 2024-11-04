import typegoose, {defaultClasses, getModelForClass} from '@typegoose/typegoose';
import {User} from '../../types/user.type.js';
import {createSHA256} from '../../helpers/createSHA256.js';
const {prop, modelOptions} = typegoose;

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export interface UserEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'users'
  }
})

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class UserEntity extends defaultClasses.TimeStamps implements User {
  @prop({unique: true, required: true})
  public email: string;

  @prop({required: true})
  public name: string;

  @prop({required: false, default: 'avatar-max.jpg'})
  public avatar?: string;

  @prop({required: false, default: ''})
  private password?: string;

  constructor(userData: User) {
    super();
    this.email = userData.email;
    this.avatar = userData.avatar;
    this.name = userData.name;
    this.userType = userData.userType;
  }

  public setPassword(password: string, salt: string) {
    this.password = createSHA256(password, salt);
  }

  public getPassword() {
    return this.password;
  }

  @prop({required: true})
  public userType: string;
}

export const UserModel = getModelForClass(UserEntity);
