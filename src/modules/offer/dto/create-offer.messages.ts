export const CreateOfferMessages = {
  name: {
    minLength: 'Minimum title length must be 10',
    maxLength: 'Maximum title length must be 100',
  },
  description: {
    minLength: 'Minimum description length must be 20',
    maxLength: 'Maximum description length must be 1024',
  },
  date: {
    invalidFormat: 'Date must be a valid ISO date',
  },
  city: {
    invalidFormat: 'City must be a valid a string',
  },
  previewImg: {
    invalidFormat: 'previewImg must be a valid a string',
  },
  images: {
    invalidFormat: 'Field images must be an array',
  },
  flagIsPremium: {
    invalidFormat: 'flagIsPremium must be a boolean',
  },
  flagIsFavourites: {
    invalidFormat: 'flagIsFavourites must be a boolean',
  },
  rating: {
    invalidFormat: 'rating must be a number',
    lengthField: 'min length is 1, max is 5',
  },
  housing: {
    invalidFormat: 'TypeHousing must be a valid a string',
  },
  countRooms: {
    invalidFormat: 'countRooms must be an integer',
    lengthField: 'min length is 1, max is 8',
  },
  countPeople: {
    invalidFormat: 'countPeople must be an integer',
    lengthField: 'min length is 1, max is 10',
  },
  price: {
    invalidFormat: 'price must be an integer',
    lengthField: 'min length is 100, max is 100000',
  },
  conveniences: {
    invalidFormat: 'conveniences must be a valid a string',
  },
  author: {
    invalidId: 'userId field must be a valid id',
  },
  coordinates: {
    invalidFormat: 'coordinates must be a valid a object',
  },
} as const;
