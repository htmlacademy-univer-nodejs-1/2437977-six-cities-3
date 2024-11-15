import {Expose} from 'class-transformer';
import {City} from '../../../types/city.enum.js';
import {Housing} from '../../../types/housing.enum.js';
import {Conveniences} from '../../../types/conveniences.enum.js';
import {User} from '../../../types/user.type.js';

export class OfferRdo {
  @Expose()
  public name!: string;

  @Expose()
  public description!: string;

  @Expose()
  public date!: Date;

  @Expose()
  public city!: City;

  @Expose()
  public previewImg!: string;

  @Expose()
  public images!: string[];

  @Expose()
  public flagIsPremium!: boolean;

  @Expose()
  public flagIsFavourites!: boolean;

  @Expose()
  public rating!: 1 | 2 | 3 | 4 | 5;

  @Expose()
  public housing!: Housing;

  @Expose()
  public countRooms!: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

  @Expose()
  public countPeople!: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

  @Expose()
  public price!: number;

  @Expose()
  public conveniences!: Conveniences;

  @Expose()
  public author!: User;

  @Expose()
  public coordinates!: string;
}
