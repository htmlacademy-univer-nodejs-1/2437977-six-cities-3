import {WriteStream} from 'node:fs';
import {createWriteStream} from 'node:fs';
import {FileWriter} from './file-writer.interface.js';

const CHUNK_SIZE = 2 ** 16;

export default class TsvFileWriter implements FileWriter {
  private stream: WriteStream;

  constructor(public readonly filename: string) {
    this.stream = createWriteStream(this.filename, {
      flags: 'w',
      encoding: 'utf-8',
      highWaterMark: CHUNK_SIZE,
      autoClose: true,
    });
  }

  public async write(row: string): Promise<void> {
    if (!this.stream.write(`${row}\n`)) {
      return new Promise((resolve) => {
        this.stream.once('drain', () => resolve());
      });
    }

    return Promise.resolve();
  }
}
