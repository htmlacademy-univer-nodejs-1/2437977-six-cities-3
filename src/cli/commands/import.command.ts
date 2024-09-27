import chalk from 'chalk';
import {Command} from './command.interface.js';
import {TsvFileReader} from '../../file-reader/tsv-file-reader.js';

export class ImportCommand implements Command {
  public readonly name = '--import';

  public execute(filename: string): void {
    const fileReader = new TsvFileReader(filename.trim());

    try {
      fileReader.read();
      console.log(fileReader.toArray());
    } catch (err) {
      if (!(err instanceof Error)) {
        throw err;
      }
      console.log(`Не удалось импортировать данные из файла: '${chalk.red(err.message)}'`);
    }
  }
}
