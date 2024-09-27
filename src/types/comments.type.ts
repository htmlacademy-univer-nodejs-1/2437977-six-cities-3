import {User} from './user.type.js';

export type Comments = {
  text: string;
  date: Date;
  rating: 1 | 2 | 3 | 4 | 5;
  author: User;
}
