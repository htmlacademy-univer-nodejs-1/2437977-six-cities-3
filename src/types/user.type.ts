import {UserEnum} from './user.enum.js';

export type User = {
  name: string;
  email: string;
  avatar?: string;
  userType: UserEnum;
}
