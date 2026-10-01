export interface IUploadDocumentInput {
  title: string;
  fileName: string;
  filePath: string;
  mimeType: string;
  size: number;
  workspaceId: string;
  userId: string;
}
