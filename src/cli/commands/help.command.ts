import chalk from 'chalk';
import {Command} from './command.interface.js';

export class HelpCommand implements Command {
  public readonly name = '--help';

  public async execute(): Promise<void> {
    console.log(`
        Программа для подготовки данных для REST API сервера.
        Пример: cli.js --<command> [--arguments]\n`,
    chalk.white('\tКоманды:\n'),
    chalk.green('\t--help:                      '), chalk.bgMagenta('# выводит этот текст\n'),
    chalk.yellow('\t--version:                   '), chalk.bgMagenta('# выводит номер версии\n'),
    chalk.red('\t--import <path>:             '), chalk.bgMagenta('# импортирует данные из файла с расширением TSV\n'),
    chalk.blue('\t--generate <n> <path> <url>  '), chalk.bgMagenta('# генерирует произвольное количество тестовых данных'));
  }
}
