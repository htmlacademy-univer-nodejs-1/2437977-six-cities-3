import {FileReaderInterface} from './file-reader.interface.js';
import {readFileSync} from 'node:fs';
import {Offer} from '../types/offer.type.js';
import {City} from '../types/city.enum.js';
import {Housing} from '../types/housing.enum.js';
import {Conveniences} from '../types/conveniences.enum.js';
import {User} from '../types/user.type.js';
import {Coordinates} from '../types/coordinates.type.js';

export class TsvFileReader implements FileReaderInterface {
  private rawData = '';

  constructor(public readonly filename: string) {
  }

  public read(): void {
    this.rawData = readFileSync(this.filename, {encoding: 'utf-8'});
  }

  public toArray(): Offer[] {
    if (!this.rawData) {
      return [];
    }
    return this.rawData
      .split('\n')
      .filter((row) => row.trim() !== '')
      .map((line) => line.split('\t'))
      .map(([name, description, date, city, previewImg, images, flagIsPremium, flagIsFavourites, rating, typeHousing, countRooms, countPeople, price, conveniences, author, countComments, coordinates]) => ({
        name: name,
        description: description,
        date: new Date(date),
        city: city as City,
        previewImg: previewImg,
        images: images.split(';'),
        flagIsPremium: flagIsPremium as unknown as boolean,
        flagIsFavourites: flagIsFavourites as unknown as boolean,
        rating: rating as unknown as 1 | 2 | 3 | 4 | 5,
        housing: typeHousing as Housing,
        countRooms: countRooms as unknown as 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8,
        countPeople: countPeople as unknown as 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10,
        price: Number.parseInt(price, 10),
        conveniences: conveniences as Conveniences,
        author: author as unknown as User,
        countComments: Number.parseInt(countComments, 10),
        coordinates: coordinates.split(',') as unknown as Coordinates,
      }));
  }
}
