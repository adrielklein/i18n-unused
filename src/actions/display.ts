import { readFileSync } from 'fs';

import { RunOptions } from '../types';

import { initialize } from '../helpers/initialize';
import { generateLocalesPathAndCodes } from '../helpers/findLocales';
import { generateFilesPaths } from '../helpers/files';
import { generateTranslationsFlatKeys } from '../helpers/flatKeys';

export const displayUnusedTranslations = async (options: RunOptions) => {
  const config = initialize(options);

  const { localesFilePaths } = await generateLocalesPathAndCodes(
    config.localesPath,
    config.localesExtensions,
  );
  
  let message = '';
  let unusedKeys = 0;

  for (const localePath of localesFilePaths) {
    const locale = require(localePath);
    const translationsKeys = generateTranslationsFlatKeys(locale);
    const filesPaths = await generateFilesPaths(`${process.cwd()}/${config.srcPath}`, config.extensions);

    [...filesPaths].forEach((filePath: string) => {
      const file = readFileSync(filePath).toString();

      [...translationsKeys].forEach((key: string) => {
        if (file.includes(key)) {
          translationsKeys.splice(translationsKeys.indexOf(key), 1);
        }
      });
    });

    message += '<<<==========================================================>>>\n';
    message += `Unused locales in: ${localePath}`;
    message += translationsKeys.map((key: string) => (key)).join(','));
    unusedKeys += translationsKeys.length
  }
  return {message, unusedKeys}
};
