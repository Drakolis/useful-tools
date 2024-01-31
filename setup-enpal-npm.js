/* eslint-disable unicorn/no-process-exit */
const process = require('node:process');
const fs = require('node:fs');
const os = require('node:os');
const Buffer = require('node:buffer').Buffer;

const token = process.argv[2]; // 0 - node, 1 - script name
console.log(token, 'Token');

if (!token) {
	console.error('No token was given!');
	process.exit();
}

const encodedToken = Buffer.from(token.trim()).toString('base64');
console.log(encodedToken, 'Encoded Token');

const pathToUserNpmRc = os.homedir() + '/.npmrc';

const content = `
; begin auth token
//pkgs.dev.azure.com/enpal/_packaging/enpal%40Local/npm/registry/:username=enpal
//pkgs.dev.azure.com/enpal/_packaging/enpal%40Local/npm/registry/:_password=${encodedToken}
//pkgs.dev.azure.com/enpal/_packaging/enpal%40Local/npm/registry/:email=npm requires email to be set but doesn't use the value
//pkgs.dev.azure.com/enpal/_packaging/enpal%40Local/npm/:username=enpal
//pkgs.dev.azure.com/enpal/_packaging/enpal%40Local/npm/:_password=${encodedToken}
//pkgs.dev.azure.com/enpal/_packaging/enpal%40Local/npm/:email=npm requires email to be set but doesn't use the value
; end auth token
`;

fs.writeFileSync(pathToUserNpmRc, content /* , { flag: 'a+' } */);

console.log('Done!');

const result = fs.readFileSync(pathToUserNpmRc).toString();

console.log(result);
