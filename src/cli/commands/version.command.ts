import chalk from 'chalk';
import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {Command} from './command.interface.js';

export class VersionCommand implements Command {
  public readonly name = '--version';

  private readVersion(): string {
    const jsonContent = readFileSync(resolve('./package.json'), 'utf-8');
    const importedContent = JSON.parse(jsonContent);

    return importedContent.version;
  }

  public async execute(): Promise<void> {
    const version = this.readVersion();
    console.log(chalk.blue.bold(version));
  }
}
