import 'reflect-metadata';
import {Container} from 'inversify';
import {Component} from './types/component.enum.js';
import {Config} from './config/config.interface.js';
import {Logger} from './logger/logger.intreface.js';
import {RestSchema} from './config/rest.schema.js';
import PinoLogger from './logger/pino.logger.js';
import Application from './rest/rest.application.js';
import RestConfig from './config/rest.config.js';

async function bootstrap() {
  const container = new Container();
  container.bind<Application>(Component.RestApplication).to(Application).inSingletonScope();
  container.bind<Logger>(Component.Logger).to(PinoLogger).inSingletonScope();
  container.bind<Config<RestSchema>>(Component.Config).to(RestConfig).inSingletonScope();
  const application = container.get<Application>(Component.RestApplication);
  await application.init();
}

bootstrap();
