export interface FileWriter {
  readonly filename: string;

  write(row: string): void;
}
