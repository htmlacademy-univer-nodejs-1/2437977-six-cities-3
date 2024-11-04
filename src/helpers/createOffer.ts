import {Offer} from '../types/offer.type.js';
import {User} from '../types/user.type.js';
import {Coordinates} from '../types/coordinates.type.js';
import {Conveniences} from '../types/conveniences.enum.js';
import {Housing} from '../types/housing.enum.js';
import {City} from '../types/city.enum.js';

export function createOffer(offerData: string): Offer {
  const [
    name,
    description,
    date,
    city,
    previewImg,
    images,
    flagIsPremium,
    flagIsFavourites,
    rating,
    housing,
    countRooms,
    countPeople,
    price,
    conveniences,
    authorName,
    authorEmail,
    authorAvatar,
    authorUserType,
    countComments,
    coordinates
  ] = offerData.replace('\n', '').split('\t');

  return {
    name,
    description,
    date: new Date(date),
    city: city as City,
    previewImg,
    images: images.split(';'),
    flagIsPremium: flagIsPremium as unknown as boolean,
    flagIsFavourites: flagIsFavourites as unknown as boolean,
    rating: rating as unknown as 1 | 2 | 3 | 4 | 5,
    housing: housing as Housing,
    countRooms: countRooms as unknown as 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8,
    countPeople: countPeople as unknown as 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10,
    price: +price,
    conveniences: conveniences as Conveniences,
    author: {
      name: authorName,
      email: authorEmail,
      avatar: authorAvatar,
      userType: authorUserType
    } as User,
    countComments: +countComments,
    coordinates: {
      latitude: +coordinates.split(',')[0],
      longitude: +coordinates.split(',')[1]
    } as Coordinates
  } as Offer;
}
