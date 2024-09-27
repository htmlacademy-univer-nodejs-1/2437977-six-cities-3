import {Conveniences} from './conveniences.enum.js';
import {User} from './user.type.js';
import {City} from './city.enum.js';
import {Coordinates} from './coordinates.type.js';
import {Housing} from './housing.enum.js';

export type Offer = {
  name: string;
  description: string;
  date: Date;
  city: City;
  previewImg: string;
  images: string[];
  flagIsPremium: boolean;
  flagIsFavourites: boolean;
  rating: 1 | 2 | 3 | 4 | 5;
  housing: Housing;
  countRooms: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
  countPeople: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
  price: number;
  conveniences: Conveniences;
  author: User;
  countComments: number;
  coordinates: Coordinates;
}
