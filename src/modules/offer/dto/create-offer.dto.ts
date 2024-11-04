import {User} from '../../../types/user.type.js';
import {Housing} from '../../../types/housing.enum.js';
import {Conveniences} from '../../../types/conveniences.enum.js';
import {City} from '../../../types/city.enum.js';

export default class CreateOfferDto {
  name!: string;
  description!: string;
  date!: Date;
  city!: City;
  previewImg!: string;
  images!: string[];
  flagIsPremium!: boolean;
  flagIsFavourites!: boolean;
  rating!: 1 | 2 | 3 | 4 | 5;
  housing!: Housing;
  countRooms!: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
  countPeople!: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
  price!: number;
  conveniences!: Conveniences;
  author!: User;
  countComments!: number;
  coordinates!: string;
}
