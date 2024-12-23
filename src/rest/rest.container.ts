import {Container} from 'inversify';
import {Component} from '../types/component.enum.js';
import {Logger} from '../logger/logger.interface.js';
import PinoService from '../logger/pino.logger.js';
import {RestSchema} from '../config/rest.schema.js';
import {DatabaseClient} from '../database-client/database-client.interface.js';
import MongoClientService from '../database-client/mongo.database-client.js';
import {Config} from '../config/config.interface.js';
import RestConfig from '../config/rest.config.js';
import Application from './rest.application.js';
import {BaseExceptionFilter} from '../exception-filters/base.exception-filter.js';
import {ValidationExceptionFilter} from '../exception-filters/validation.exception-filter.js';
import {HttpErrorExceptionFilter} from '../exception-filters/http-error.exception-filter.js';

class ExceptionFilterInterface {
}

export function createRestApplicationContainer() {
  const restApplicationContainer = new Container();

  restApplicationContainer.bind<Application>(Component.RestApplication).to(Application).inSingletonScope();
  restApplicationContainer.bind<Logger>(Component.Logger).to(PinoService).inSingletonScope();
  restApplicationContainer.bind<Config<RestSchema>>(Component.Config).to(RestConfig).inSingletonScope();
  restApplicationContainer.bind<DatabaseClient>(Component.DatabaseClient).to(MongoClientService).inSingletonScope();
  restApplicationContainer.bind<ExceptionFilterInterface>(Component.HttpErrorExceptionFilter).to(HttpErrorExceptionFilter).inSingletonScope();
  restApplicationContainer.bind<ExceptionFilterInterface>(Component.ValidationExceptionFilter).to(ValidationExceptionFilter).inSingletonScope();
  restApplicationContainer.bind<ExceptionFilterInterface>(Component.BaseExceptionFilter).to(BaseExceptionFilter).inSingletonScope();

  return restApplicationContainer;
}
