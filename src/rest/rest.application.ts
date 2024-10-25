import {inject, injectable} from 'inversify';
import {Config} from '../config/config.interface.js';
import {Logger} from '../logger/logger.interface.js';
import {RestSchema} from '../config/rest.schema.js';
import {Component} from '../types/component.enum.js';
import {DatabaseClient} from '../database-client/database-client.interface.js';
import {getMongoURI} from '../helpers/getMongoURI.js';

@injectable()
export default class Application {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.Config) private readonly config: Config<RestSchema>,
    @inject(Component.DatabaseClient) private readonly databaseClient: DatabaseClient) {}

  private async _initDb() {
    const mongoUri = getMongoURI(
      this.config.get('DB_USER'),
      this.config.get('DB_PASSWORD'),
      this.config.get('DB_HOST'),
      this.config.get('DB_PORT'),
      this.config.get('DB_NAME'),
    );

    return this.databaseClient.connect(mongoUri);
  }

  public async init() {
    this.logger.info('Application init');
    this.logger.info(`Get value from env $PORT: ${this.config.get('PORT')}`);
    this.logger.info('Init database');
    await this._initDb();
    this.logger.info('Init database completed');
  }
}
