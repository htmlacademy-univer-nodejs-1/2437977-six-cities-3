export interface FileReader {
  readonly filename: string;

  read(): void;
}
