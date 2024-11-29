import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsInt, IsMongoId,
  IsNumber,
  IsObject,
  IsString, Length,
  MaxLength,
  MinLength
} from 'class-validator';
import {User} from '../../../types/user.type.js';
import {Housing} from '../../../types/housing.enum.js';
import {Conveniences} from '../../../types/conveniences.enum.js';
import {City} from '../../../types/city.enum.js';
import {CreateOfferMessages} from './create-offer.messages.js';

export default class CreateOfferDto {
  @MinLength(10, {message: CreateOfferMessages.name.minLength})
  @MaxLength(100, {message: CreateOfferMessages.name.maxLength})
    name!: string;

  @MinLength(20, {message: CreateOfferMessages.name.minLength})
  @MaxLength(1024, {message: CreateOfferMessages.name.maxLength})
    description!: string;

  @IsDateString({}, {message: CreateOfferMessages.date.invalidFormat})
    date!: Date;

  @IsString({message: CreateOfferMessages.city.invalidFormat})
    city!: City;

  @IsString({message: CreateOfferMessages.previewImg.invalidFormat})
    previewImg!: string;

  @IsArray({message: CreateOfferMessages.images.invalidFormat})
    images!: string[];

  @IsBoolean({message: CreateOfferMessages.flagIsPremium.invalidFormat})
    flagIsPremium!: boolean;

  @IsBoolean({message: CreateOfferMessages.flagIsFavourites.invalidFormat})
    flagIsFavourites!: boolean;

  @IsNumber({}, {message: CreateOfferMessages.rating.invalidFormat})
  @Length(1, 5, {message: CreateOfferMessages.rating.lengthField})
    rating!: 1 | 2 | 3 | 4 | 5;

  @IsString({message: CreateOfferMessages.housing.invalidFormat})
    housing!: Housing;

  @IsInt({message: CreateOfferMessages.countRooms.invalidFormat})
  @Length(1, 8, {message: CreateOfferMessages.countRooms.lengthField})
    countRooms!: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

  @IsInt({message: CreateOfferMessages.countPeople.invalidFormat})
  @Length(1, 10, {message: CreateOfferMessages.countPeople.lengthField})
    countPeople!: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

  @IsNumber({}, {message: CreateOfferMessages.price.invalidFormat})
  @Length(100, 100000, {message: CreateOfferMessages.price.lengthField})
    price!: number;

  @IsString({message: CreateOfferMessages.conveniences.invalidFormat})
    conveniences!: Conveniences;

  @IsMongoId({message: CreateOfferMessages.author.invalidId})
    author!: User;

  countComments!: number;

  @IsObject({message: CreateOfferMessages.coordinates.invalidFormat})
    coordinates!: string;
}
