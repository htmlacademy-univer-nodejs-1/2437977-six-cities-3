import {User} from './user.type.js';
import {Conveniences} from './conveniences.enum.js';

export type MockServerData = {
  name: string[];
  description: string[];
  previewImg: string[];
  images: string[];
  conveniences: Conveniences[];
  countComments: string[];
  author: User[];
  coordinates: number[];
}
