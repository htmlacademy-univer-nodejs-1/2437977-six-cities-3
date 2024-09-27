import {Command} from './commands/command.interface.js';
import {CommandParser} from './command-parser.js';

type CommandCollection = Record<string, Command>;

export class CLIApplication {
  private commands: CommandCollection = {};
  private defaultCommand = '--help';

  public getCommand(commandName: string): Command {
    return this.commands[commandName] ?? this.commands[this.defaultCommand];
  }

  public processCommand(argv: string[]): void {
    const parsedCommand = CommandParser.parse(argv);
    const [commandName] = Object.keys(parsedCommand);
    const command = this.getCommand(commandName);
    const commandArguments = parsedCommand[commandName] ?? [];
    command.execute(...commandArguments);
  }

  public registerCommands(commandList: Command[]): void {
    commandList.forEach((command) => {
      if (Object.hasOwn(this.commands, command.name)) {
        throw new Error(`Command ${command.name} is already registered`);
      }
      this.commands[command.name] = command;
    });
  }
}
