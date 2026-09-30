export interface DocumentTextExtractor {
  extract(filePath: string): Promise<string>;
}
