import { decrypt, encrypt } from '@b127/crypto';
import chalk from 'chalk';
import fs from 'node:fs/promises';
import path from 'node:path';
import { cwd } from 'node:process';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { formatPath } from './lib/formatPath.js';
import { promptPassphrase } from './lib/promptPassphrase.js';

(async () => {
  const {
    d,
    o,
    _: files
  } = await yargs(hideBin(process.argv))
    .usage('Encrypt or decrypt files.\n\nUsage: $0 file1 file2')
    .option('d', { describe: 'Decrypt encrypted file(s)', type: 'boolean' })
    .option('o', { describe: 'Output directory', type: 'string' }).argv;

  if (files.length === 0) {
    console.error(
      chalk.italic('No files specified') + '\n\nfor help run --help'
    );
    process.exit(1);
  }

  const passphrase = await promptPassphrase(!d);
  const target = typeof o === 'string' ? path.resolve(o) : cwd();

  await fs.mkdir(target, { recursive: true });
  const action = d ? decrypt : encrypt;

  for (const file of files as string[]) {
    try {
      let result = await action(path.resolve(file), passphrase, target);
      if (!Array.isArray(result)) result = [result];
      result.forEach((resultFile) => {
        console.log(
          chalk.italic(
            `${formatPath(resultFile.file)} -> ${formatPath(resultFile.target)}`
          )
        );
      });
    } catch (err) {
      console.error(chalk.red(formatPath(file)));
    }
  }
})();
