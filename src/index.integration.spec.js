import { execaCommand } from 'execa';
import fs from 'fs-extra';
import withLocalTmpDir from 'with-local-tmp-dir';

export default {
  before: () => execaCommand('base prepublishOnly'),
  works: () =>
    withLocalTmpDir(async () => {
      await fs.outputFile(
        '.stylelintrc.json',
        JSON.stringify({ extends: '../dist/index.js' }),
      );

      await fs.outputFile('index.scss', '');
      await execaCommand('stylelint index.scss');
    }),
};
