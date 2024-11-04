import dayjs from 'dayjs';
import {getRandomItem} from '../../helpers/getRandomItem.js';
import {generateRandomValue} from '../../helpers/generateRandomValue.js';
import {Housing} from '../../types/housing.enum.js';
import {City} from '../../types/city.enum.js';
import {MockServerData} from '../../types/mock-server-data.type.js';
import {OfferGenerator} from './offer-generator.interface.js';
import {User} from '../../types/user.type.js';
import {Conveniences} from '../../types/conveniences.enum.js';
import {Coordinates} from '../../types/coordinates.type.js';

const MIN_PRICE = 100;
const MAX_PRICE = 100000;
const FIRST_WEEK_DAY = 1;
const LAST_WEEK_DAY = 7;

export default class TSVOfferGenerator implements OfferGenerator {
  constructor(private readonly mockData: MockServerData) {
  }

  public generate(): string {
    const name = getRandomItem<string>(this.mockData.name);
    const description = getRandomItem<string>(this.mockData.description);
    const date = dayjs().subtract(generateRandomValue(FIRST_WEEK_DAY, LAST_WEEK_DAY), 'day').toISOString();
    const city = getRandomItem([City.Amsterdam, City.Cologne, City.Brussels, City.Paris, City.Hamburg, City.Dusseldorf]);
    const rating = getRandomItem([1, 2, 3, 4, 5]);
    const typeHousing = getRandomItem([Housing.House, Housing.Hotel, Housing.Room, Housing.Apartment]);
    const flagIsPremium = getRandomItem([true, false]);
    const flagIsFavourites = getRandomItem([true, false]);
    const countRooms = getRandomItem([1, 2, 3, 4, 5, 6, 7, 8]);
    const countPeople = getRandomItem([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    const previewImg = getRandomItem<string>(this.mockData.previewImg);
    const price = generateRandomValue(MIN_PRICE, MAX_PRICE).toString();
    const images = getRandomItem<string>(this.mockData.images);
    const conveniences = getRandomItem<Conveniences>([
      Conveniences.Breakfast,
      Conveniences.Air_conditioning,
      Conveniences.Fridge,
      Conveniences.Towels,
      Conveniences.Baby_seat,
      Conveniences.Laptop_friendly_workspace,
      Conveniences.Washer
    ]);
    const author = getRandomItem<User>(this.mockData.author);
    const countComments = getRandomItem<string>(this.mockData.countComments);
    const coordinates = getRandomItem<Coordinates>(this.mockData.coordinates);

    return [
      name,
      description,
      date,
      city,
      previewImg,
      images,
      flagIsPremium,
      flagIsFavourites,
      rating,
      typeHousing,
      countRooms,
      countPeople,
      price,
      conveniences,
      author.name,
      author.email,
      author.avatar,
      author.userType,
      countComments,
      coordinates
    ].join('\t');
  }
}
