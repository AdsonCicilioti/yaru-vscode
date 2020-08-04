const fs = require('fs');
const path = require('path');
const generate = require('./generate');

const THEME_DIR = path.join(__dirname, '..', 'theme');

if (!fs.existsSync(THEME_DIR)) {
  fs.mkdirSync(THEME_DIR);
}

module.exports = async () => {
  const { dark, darkGrape, darkPumpkin } = await generate();

  return Promise.all([
    fs.promises.writeFile(
      path.join(THEME_DIR, 'yaru-dark.json'),
      JSON.stringify(dark, null, 4)
    ),
    fs.promises.writeFile(
      path.join(THEME_DIR, 'yaru-dark-grape.json'),
      JSON.stringify(darkGrape, null, 4)
    ),
    fs.promises.writeFile(
      path.join(THEME_DIR, 'yaru-dark-pumpkin.json'),
      JSON.stringify(darkPumpkin, null, 4)
    ),
  ]);
};

if (require.main === module) {
  module.exports();
}
