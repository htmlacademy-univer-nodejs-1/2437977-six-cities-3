import got from 'got';
import chalk from 'chalk';
import {Command} from './command.interface.js';
import {MockServerData} from '../../types/mock-server-data.type.js';
import TSVOfferGenerator from '../offer-generator/tsv-offer-generator.js';
import TsvFileWriter from '../../file-writer/tsv-file-writer.js';

export class GenerateCommand implements Command {
  public readonly name = '--generate';
  private initialData!: MockServerData;

  public async execute(...parameters: string[]): Promise<void> {
    const [count, filepath, url] = parameters;
    const offerCount = Number.parseInt(count, 10);

    try {
      this.initialData = await got.get(url).json();
    } catch {
      console.error(chalk.red(`Can't fetch data from ${url}`));
      return;
    }

    const offerGeneratorString = new TSVOfferGenerator(this.initialData);
    const tsvFileWriter = new TsvFileWriter(filepath);

    for (let i = 0; i < offerCount; i++) {
      await tsvFileWriter.write(offerGeneratorString.generate());
    }

    console.log(`File ${filepath} was created`);
  }
}
