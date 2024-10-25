import 'reflect-metadata';
import {Container} from 'inversify';
import {Component} from './types/component.enum.js';
import Application from './rest/rest.application.js';
import {createRestApplicationContainer} from './rest/rest.container.js';
import {createUserContainer} from './modules/user/user.container.js';
import {createOfferContainer} from './modules/offer/offer.container.js';

async function bootstrap() {
  const mainContainer = Container.merge(
    createRestApplicationContainer(),
    createUserContainer(),
    createOfferContainer(),
  );
  const application = mainContainer.get<Application>(Component.RestApplication);
  await application.init();
}

bootstrap().then((value) => console.log(value));
