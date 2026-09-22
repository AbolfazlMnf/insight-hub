#!/usr/bin/env -S node
import type { Contract as Start } from '../../snapshots/242d849f3e5fc82f6306a2a042ddab049522a2adc23633db41cec6f8b6a7d929/contract';
import startContract from '../../snapshots/242d849f3e5fc82f6306a2a042ddab049522a2adc23633db41cec6f8b6a7d929/contract.json' with { type: 'json' };
import type { Contract as End } from '../../snapshots/5d01f52d437a037d33dcb98fd4cd0cca9539806b434c1b5e6a824e34af373416/contract';
import endContract from '../../snapshots/5d01f52d437a037d33dcb98fd4cd0cca9539806b434c1b5e6a824e34af373416/contract.json' with { type: 'json' };
import { Migration, MigrationCLI } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.createIndex({
        schema: 'public',
        table: 'WorkspaceMember',
        index: 'WorkspaceMember_userId_workspaceId_idx_fa32762a',
        columns: ['userId', 'workspaceId'],
        extras: { unique: true },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
