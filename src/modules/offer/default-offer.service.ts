import {inject, injectable} from 'inversify';
import { DocumentType, types } from '@typegoose/typegoose';
import CreateOfferDto from './dto/create-offer.dto.js';
import {OfferEntity} from './offer.entity.js';
import {OfferService} from './offer-service.interface.js';
import {Logger} from '../../logger/logger.interface.js';
import {Component} from '../../types/component.enum.js';

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
}
