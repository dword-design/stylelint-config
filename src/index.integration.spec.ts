import pathLib from 'node:path';

import { test } from '@playwright/test';
import { execaCommand } from 'execa';
import fs from 'fs-extra';

test.beforeAll(() => execaCommand('base prepublishOnly'));

test('works', async ({}, testInfo) => {
  const cwd = testInfo.outputPath();

  await fs.outputFile(
    pathLib.join(cwd, '.stylelintrc.json'),
    JSON.stringify({ extends: '../../dist/index.js' }),
  );

  await fs.outputFile('index.scss', '');
  await execaCommand('stylelint index.scss');
});
