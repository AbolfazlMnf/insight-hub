#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/0cf18092f5382197e0e3cf46f8d12e3182808a0fd8a8c8992a13dee7c0496603/contract';
import endContract from '../../snapshots/0cf18092f5382197e0e3cf46f8d12e3182808a0fd8a8c8992a13dee7c0496603/contract.json' with { type: 'json' };
import type { Contract as Start } from '../../snapshots/5d01f52d437a037d33dcb98fd4cd0cca9539806b434c1b5e6a824e34af373416/contract';
import startContract from '../../snapshots/5d01f52d437a037d33dcb98fd4cd0cca9539806b434c1b5e6a824e34af373416/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, placeholder } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.createNativeEnumType({
        schema: 'public',
        typeName: 'WorkspaceMemberRole',
        members: ['ADMIN', 'MEMBER', 'OWNER'],
      }),
      this.dataTransform(endContract, 'typechange-WorkspaceMember-role', {
        check: () => placeholder('typechange-WorkspaceMember-role:check'),
        run: () => placeholder('typechange-WorkspaceMember-role:run'),
      }),
      this.alterColumnType({
        schema: 'public',
        table: 'WorkspaceMember',
        column: 'role',
        options: {
          qualifiedTargetType: '"WorkspaceMemberRole"',
          formatTypeExpected: 'WorkspaceMemberRole',
          rawTargetTypeForLabel: '"WorkspaceMemberRole"',
        },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
