import { cwd } from 'process';

export function formatPath(path: string): string {
  if (path.startsWith(cwd())) return path.slice(cwd().length + 1);
  return path;
}
