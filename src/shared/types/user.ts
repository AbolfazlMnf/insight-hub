import { UserRole } from 'src/generated/prisma/enums';

export interface IUserPayload {
  id: string;
  role: UserRole;
  iat?: number;
  exp?: number;
}
