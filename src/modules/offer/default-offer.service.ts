import {inject, injectable} from 'inversify';
import {DocumentType, types} from '@typegoose/typegoose';
import CreateOfferDto from './dto/create-offer.dto.js';
import {OfferEntity} from './offer.entity.js';
import {OfferService} from './offer-service.interface.js';
import {Logger} from '../../logger/logger.interface.js';
import {Component} from '../../types/component.enum.js';
import UpdateOfferDto from './dto/update-offer.dto.js';
import {Sort} from '../../types/sort-type.enum.js';
import {DEFAULT_OFFER_COUNT} from './offer.constant.js';

@injectable()
export default class DefaultOfferService implements OfferService {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.OfferModel) private readonly offerModel: types.ModelType<OfferEntity>
  ) {}

  public async create(dto: CreateOfferDto): Promise<DocumentType<OfferEntity>> {
    const result = await this.offerModel.create(dto);
    this.logger.info(`New offer created: ${dto.name}`);
    return result;
  }

  public async findById(offerId: string): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel.findById(offerId).exec();
  }

  public async find(count?: number): Promise<DocumentType<OfferEntity>[]> {
    const limitCount = count ?? DEFAULT_OFFER_COUNT;
    return this.offerModel
      .find()
      .sort({createdAt: Sort.Down})
      .limit(limitCount)
      .populate('offerId')
      .exec();
  }

  public async deleteById(offerId: string): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel.findByIdAndDelete(offerId).exec();
  }

  public async updateById(offerId: string, dto: UpdateOfferDto): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel.findByIdAndUpdate(offerId, dto, {new: true}).populate('offerId').exec();
  }

  public async getDetailsInfo(offerId: string): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel.findById(offerId).exec();
  }

  public async incCommentCount(offerId: string): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel
      .findByIdAndUpdate(offerId, {
        '$inc': {
          commentCount: 1,
        }
      })
      .exec();
  }

  public async getPremium(): Promise<DocumentType<OfferEntity>[]> {
    return this.offerModel.find({flagIsPremium: true}).populate('offerId').exec();
  }

  public async calculationRating(rating: number, newRating: number, countRating: number, offerId: string): Promise<void> {
    await this.offerModel.findByIdAndUpdate(offerId, {rating: (newRating + rating) / countRating}, {new: true}).exec();
  }

  public async exists(documentId: string): Promise<boolean> {
    return (await this.offerModel.exists({_id: documentId})) !== null;
  }
}
