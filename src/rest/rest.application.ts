import {inject, injectable} from 'inversify';
import express, {Express} from 'express';
import {Config} from '../config/config.interface.js';
import {Logger} from '../logger/logger.interface.js';
import {RestSchema} from '../config/rest.schema.js';
import {Component} from '../types/component.enum.js';
import {DatabaseClient} from '../database-client/database-client.interface.js';
import {getMongoURI} from '../helpers/getMongoURI.js';
import {ExceptionFilter} from '../exception-filters/exception-filter.interface.js';
import {BaseController} from '../controller/base-controller.js';

@injectable()
export default class Application {
  private server: Express;

  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.Config) private readonly config: Config<RestSchema>,
    @inject(Component.DatabaseClient) private readonly databaseClient: DatabaseClient,
    @inject(Component.AppExceptionFilter) private readonly exceptionFilter: ExceptionFilter,
    @inject(Component.UserController) private readonly userController: BaseController,
    @inject(Component.OfferController) private readonly offerController: BaseController,
    @inject(Component.CommentController) private readonly commentController: BaseController,
  ) {
    this.server = express();
  }

  private async _initDb() {
    this.logger.info('Init database');

    const mongoUri = getMongoURI(
      this.config.get('DB_USER'),
      this.config.get('DB_PASSWORD'),
      this.config.get('DB_HOST'),
      this.config.get('DB_PORT'),
      this.config.get('DB_NAME'),
    );

    this.logger.info('Init database completed');

    return this.databaseClient.connect(mongoUri);
  }

  private async _initServer() {
    this.logger.info('Try to init server');

    const port = this.config.get('PORT');
    this.server.listen(port);

    this.logger.info(`Server started on http://localhost:${this.config.get('PORT')}`);
  }

  private async _initControllers(){
    this.logger.info('Controller init');

    this.server.use('/users', this.userController.router);
    this.server.use('/offers', this.offerController.router);
    this.server.use('/comments', this.commentController.router);

    this.logger.info('Controller completed');
  }

  private async _initMiddleware() {
    this.logger.info('Init middleware');

    this.server.use(express.json());

    this.logger.info('Middleware init completed');
  }

  private async _initExceptionFilters() {
    this.logger.info('Init exception filters');

    this.server.use(this.exceptionFilter.catch.bind(this.exceptionFilter));

    this.logger.info('Exception filters completed');
  }

  public async init() {
    this.logger.info('Application init');

    await this._initDb();
    await this._initMiddleware();
    await this._initExceptionFilters();
    await this._initServer();
    await this._initControllers();
  }
}
