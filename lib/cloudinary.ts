import { createHash } from 'node:crypto';

export function cloudinaryUserFolder(userId: string) {
  return createHash('sha256').update(userId).digest('hex');
}
