import {Container} from 'inversify';
import {types} from '@typegoose/typegoose';
import DefaultOfferService from './default-offer.service.js';
import {OfferEntity, OfferModel} from './offer.entity.js';
import {OfferService} from './offer-service.interface.js';
import {Component} from '../../types/component.enum.js';

export function createOfferContainer() {
  const offerContainer = new Container();

  offerContainer.bind<OfferService>(Component.OfferService).to(DefaultOfferService);
  offerContainer.bind<types.ModelType<OfferEntity>>(Component.OfferModel).toConstantValue(OfferModel);

  return offerContainer;
}
