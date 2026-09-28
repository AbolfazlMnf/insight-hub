import { Module } from '@nestjs/common';
import { DocumentService } from './services/document.service';
import { DocumentController } from './document.controller';
import { WorkspaceModule } from 'src/workspace/workspace.module';
import { DocumentProcessorService } from './services/document-processor.service';

@Module({
  imports: [WorkspaceModule],
  providers: [DocumentService, DocumentProcessorService],
  controllers: [DocumentController],
})
export class DocumentModule {}
