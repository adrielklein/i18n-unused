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
  
  let unusedKeysCount = 0;
  const unusedTranslations = [];

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
    unusedTranslations.push({localePath, translationsKeys })


    unusedKeysCount += translationsKeys.length
  }
  return {unusedKeysCount, unusedTranslations}
};
