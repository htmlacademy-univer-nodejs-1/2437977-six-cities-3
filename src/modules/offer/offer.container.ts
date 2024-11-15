import {Container} from 'inversify';
import {types} from '@typegoose/typegoose';
import DefaultOfferService from './default-offer.service.js';
import {OfferEntity, OfferModel} from './offer.entity.js';
import {OfferService} from './offer-service.interface.js';
import {Component} from '../../types/component.enum.js';
import OfferController from './controller/offer.controller.js';
import {BaseController} from '../../controller/base-controller.js';

export function createOfferContainer() {
  const offerContainer = new Container();

  offerContainer.bind<OfferService>(Component.OfferService).to(DefaultOfferService);
  offerContainer.bind<types.ModelType<OfferEntity>>(Component.OfferModel).toConstantValue(OfferModel);
  offerContainer.bind<BaseController>(Component.OfferController).to(OfferController).inSingletonScope();

  return offerContainer;
}
