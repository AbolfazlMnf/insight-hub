import { Module } from '@nestjs/common';
import { DocumentService } from './document.service';
import { DocumentController } from './document.controller';
import { WorkspaceModule } from 'src/workspace/workspace.module';

@Module({
  imports: [WorkspaceModule],
  providers: [DocumentService],
  controllers: [DocumentController],
})
export class DocumentModule {}
