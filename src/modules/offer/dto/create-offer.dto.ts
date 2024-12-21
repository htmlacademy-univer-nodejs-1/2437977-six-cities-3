import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsInt,
  IsNumber,
  IsObject,
  IsString, Length,
  MaxLength,
  MinLength
} from 'class-validator';
import {Housing} from '../../../types/housing.enum.js';
import {Conveniences} from '../../../types/conveniences.enum.js';
import {City} from '../../../types/city.enum.js';
import {CreateOfferMessages} from './create-offer.messages.js';

export default class CreateOfferDto {
  @MinLength(10, {message: CreateOfferMessages.name.minLength})
  @MaxLength(100, {message: CreateOfferMessages.name.maxLength})
  public name!: string;

  @MinLength(20, {message: CreateOfferMessages.name.minLength})
  @MaxLength(1024, {message: CreateOfferMessages.name.maxLength})
  public description!: string;

  @IsDateString({}, {message: CreateOfferMessages.date.invalidFormat})
  public date!: Date;

  @IsString({message: CreateOfferMessages.city.invalidFormat})
  public city!: City;

  @IsString({message: CreateOfferMessages.previewImg.invalidFormat})
  public previewImg!: string;

  @IsArray({message: CreateOfferMessages.images.invalidFormat})
  public images!: string[];

  @IsBoolean({message: CreateOfferMessages.flagIsPremium.invalidFormat})
  public flagIsPremium!: boolean;

  @IsBoolean({message: CreateOfferMessages.flagIsFavourites.invalidFormat})
  public flagIsFavourites!: boolean;

  @IsNumber({}, {message: CreateOfferMessages.rating.invalidFormat})
  @Length(1, 5, {message: CreateOfferMessages.rating.lengthField})
  public rating!: 1 | 2 | 3 | 4 | 5;

  @IsString({message: CreateOfferMessages.housing.invalidFormat})
  public housing!: Housing;

  @IsInt({message: CreateOfferMessages.countRooms.invalidFormat})
  @Length(1, 8, {message: CreateOfferMessages.countRooms.lengthField})
  public countRooms!: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

  @IsInt({message: CreateOfferMessages.countPeople.invalidFormat})
  @Length(1, 10, {message: CreateOfferMessages.countPeople.lengthField})
  public countPeople!: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

  @IsNumber({}, {message: CreateOfferMessages.price.invalidFormat})
  @Length(100, 100000, {message: CreateOfferMessages.price.lengthField})
  public price!: number;

  @IsString({message: CreateOfferMessages.conveniences.invalidFormat})
  public conveniences!: Conveniences;

  public userId!: string;

  public countComments!: number;

  @IsObject({message: CreateOfferMessages.coordinates.invalidFormat})
  public coordinates!: string;
}
