const { readFile } = require('fs').promises;
const { join } = require('path');
const { Type, Schema, load } = require('js-yaml');
const tinycolor = require('tinycolor2');

/**
 * @typedef {Object} TokenColor - Textmate token color.
 * @prop {string} [name] - Optional name.
 * @prop {string[]} scope - Array of scopes.
 * @prop {Record<'foreground'|'background'|'fontStyle',string|undefined>} settings - Textmate token settings.
 *       Note: fontStyle is a space-separated list of any of `italic`, `bold`, `underline`.
 */

/**
 * @typedef {Object} Theme - Parsed theme object.
 * @prop {Record<'base'|'ansi'|'brightOther'|'other', string[]>} yaru - Yaru color variables.
 * @prop {Record<string, string|null|undefined>} colors - VSCode color mapping.
 * @prop {TokenColor[]} tokenColors - Textmate token colors.
 */

/**
 * @typedef {(yamlContent: string, yamlObj: Theme) => Theme} ThemeTransform
 */

const withAlphaType = new Type('!alpha', {
  kind: 'sequence',
  construct: ([hexRGB, alpha]) => hexRGB + alpha,
  represent: ([hexRGB, alpha]) => hexRGB + alpha,
});

const schema = Schema.create([withAlphaType]);

module.exports = async () => {
  const darkYml = await readFile(
    join(__dirname, '..', 'src', 'yaru-dark.yml'),
    'utf-8'
  );
  const grapeYml = await readFile(
    join(__dirname, '..', 'src', 'yaru-dark grape.yml'),
    'utf-8'
  );
  const pumpkinYml = await readFile(
    join(__dirname, '..', 'src', 'yaru-dark-pumpkin.yml'),
    'utf-8'
  );

  /** @type {Theme} */
  const dark = load(darkYml, { schema });
  const darkGrape = load(grapeYml, { schema });
  const darkPumpkin = load(pumpkinYml, { schema });

  // Remove nulls and other falsey values from colors
  for (const key of Object.keys(dark.colors)) {
    if (!dark.colors[key]) {
      delete dark.colors[key];
    }
  }
  for (const key of Object.keys(darkGrape.colors)) {
    if (!darkGrape.colors[key]) {
      delete darkGrape.colors[key];
    }
  }
  for (const key of Object.keys(darkPumpkin.colors)) {
    if (!darkPumpkin.colors[key]) {
      delete darkPumpkin.colors[key];
    }
  }

  return {
    dark,
    darkGrape,
    darkPumpkin,
  };
};
