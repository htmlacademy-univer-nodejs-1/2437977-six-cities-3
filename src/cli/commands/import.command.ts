import chalk from 'chalk';
import {Command} from './command.interface.js';
import {getErrorMessage} from '../../helpers/getErrorMessage.js';
import {createOffer} from '../../helpers/createOffer.js';
import TsvFileReader from '../../file-reader/tsv-file-reader.js';
import {UserService} from '../../modules/user/user-service.interface.js';
import {OfferService} from '../../modules/offer/offer-service.interface.js';
import {DatabaseClient} from '../../database-client/database-client.interface.js';
import {Logger} from '../../logger/logger.interface.js';
import ConsoleLogger from '../../logger/console.logger.js';
import {OfferModel} from '../../modules/offer/offer.entity.js';
import {UserModel} from '../../modules/user/user.entity.js';
import MongoClientService from '../../database-client/mongo.database-client.js';
import DefaultOfferService from '../../modules/offer/default-offer.service.js';
import DefaultUserService from '../../modules/user/default-user.service.js';
import {Offer} from '../../types/offer.type.js';
import {getMongoURI} from '../../helpers/getMongoURI.js';

const DEFAULT_DB_PORT = '27017';
const DEFAULT_USER_PASSWORD = 'test';

export class ImportCommand implements Command {
  public readonly name = '--import';
  private userService!: UserService;
  private offerService!: OfferService;
  private databaseService!: DatabaseClient;
  private logger: Logger;
  private salt!: string;

  constructor() {
    this.onLine = this.onLine.bind(this);
    this.onComplete = this.onComplete.bind(this);
    this.logger = new ConsoleLogger();
    this.offerService = new DefaultOfferService(this.logger, OfferModel);
    this.userService = new DefaultUserService(this.logger, UserModel);
    this.databaseService = new MongoClientService(this.logger);
  }

  private async saveOffer(offer: Offer) {
    const user = await this.userService.findOrCreate({
      ...offer.author,
      password: DEFAULT_USER_PASSWORD
    }, this.salt);

    await this.offerService.create({
      ...offer,
      author: user,
      coordinates: `${offer.coordinates.latitude},${offer.coordinates.longitude}`
    });
  }

  private async onLine(line: string, resolve: () => void) {
    const offer = createOffer(line);
    await this.saveOffer(offer);
    resolve();
  }

  private onComplete(count: number) {
    console.log(`${count} rows imported.`);
    this.databaseService.disconnect();
  }

  public async execute(filename: string, login: string, password: string, host: string, dbname: string, salt: string): Promise<void> {
    if (filename === undefined) {
      console.log(chalk.red('Укажите после команды --import путь к файлу'));
    }
    const uri = getMongoURI(login, password, host, DEFAULT_DB_PORT, dbname);
    this.salt = salt;
    await this.databaseService.connect(uri);

    const fileReader = new TsvFileReader(filename.trim());

    fileReader.on('line', this.onLine);
    fileReader.on('end', this.onComplete);

    try {
      await fileReader.read();
    } catch (err) {
      console.error(chalk.red(`Can't read the file: ${getErrorMessage(err)}`));
    }
  }
}
