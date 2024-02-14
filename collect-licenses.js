/* eslint-disable unicorn/no-array-reduce */
const process = require('node:process');
const {
  readdirSync,
  readFileSync,
  writeFileSync,
  appendFileSync,
} = require('node:fs');
const { join } = require('node:path');

const projectPath = process.argv[2]; // 0 - node, 1 - script name

const path = join(projectPath, 'node_modules');
const packageFile = 'package.json';
const modules = readdirSync(path);
const licensesMdPath = join(projectPath, 'LICENSES.MD');

const properModules = modules
  .filter((module) => !module.startsWith('.'))
  .reduce((accumulator, module) => {
    if (!module.includes('@')) {
      return [...accumulator, module];
    }

    const submodules = readdirSync(join(path, module)).map((submodule) =>
      join(module, submodule)
    );
    return [...accumulator, ...submodules];
  }, []);

const moduleData = properModules.map((module) => {
  const packageJSON = JSON.parse(readFileSync(join(path, module, packageFile)));
  const name = packageJSON.name || 'noname:' + module;
  const license = packageJSON.license || 'unknown license';
  const version = packageJSON.version || 'unknown version';
  const author = packageJSON.author || 'unknown author';
  return {
    name,
    license,
    version,
    author,
  };
});

writeFileSync(
  licensesMdPath,
  `
Name | Version | License | Author
--- | --- | --- | ---
`
);

const licenseData = {};

for (const data of moduleData) {
  let authorString = data.author;
  if (typeof authorString === 'object') {
    if (
      !Object.keys(authorString).includes('name') &&
      !Object.keys(authorString).includes('email') &&
      !Object.keys(authorString).includes('url')
    ) {
      console.log(JSON.stringify(authorString));
      if (Array.isArray(authorString)) {
        authorString = authorString.join(', ');
      }
    } else {
      authorString = `${authorString.name} <${authorString.email}> [${authorString.url}]`;
    }
  }

  if (licenseData[data.license]) {
    licenseData[data.license] += 1;
  } else {
    licenseData[data.license] = 1;
  }

  appendFileSync(
    licensesMdPath,
    `${data.name} | ${data.version} | ${data.license} | ${authorString}
`
  );
}

appendFileSync(licensesMdPath, `\n`);

for (const license of Object.keys(licenseData)) {
  appendFileSync(licensesMdPath, `* ${license}: ${licenseData[license]}\n`);
}
