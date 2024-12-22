import {DocumentType} from '@typegoose/typegoose';
import {OfferEntity} from './offer.entity.js';
import CreateOfferDto from './dto/create-offer.dto.js';
import UpdateOfferDto from './dto/update-offer.dto.js';
import {DocumentExists} from '../../types/document-exists.interface.js';

export interface OfferService extends DocumentExists {
  create(dto: CreateOfferDto): Promise<DocumentType<OfferEntity>>;
  findById(offerId: string): Promise<DocumentType<OfferEntity> | null>;
  find(): Promise<DocumentType<OfferEntity>[]>;
  deleteById(offerId: string): Promise<DocumentType<OfferEntity> | null>;
  updateById(offerId: string, dto: UpdateOfferDto): Promise<DocumentType<OfferEntity> | null>;
  getDetailsInfo(offerId: string): Promise<DocumentType<OfferEntity> | null>;
  incCommentCount(offerId: string): Promise<DocumentType<OfferEntity> | null>;
  getPremium(): Promise<DocumentType<OfferEntity>[]>;
  calculationRating(rating: number, newRating: number, countRating:number, offerId:string): Promise<void>;
  exists(documentId: string): Promise<boolean>;
  findPremiumByCity(city: string): Promise<DocumentType<OfferEntity>[]>;
  addFavorite(offerId: string, userId: string): Promise<void>;
  deleteFavorite(offerId: string, userId: string): Promise<void>;
}
