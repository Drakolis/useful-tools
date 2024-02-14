/* eslint-disable unicorn/no-process-exit */
const process = require('node:process');
const { exec } = require('node:child_process');

const processNames = process.argv.slice(2);

if (processNames.length === 0) {
  console.log('No process name was given!');
  process.exit(0);
}

console.log('Process names:', processNames.join(', '));
function killAllByProcessName(processName) {
  exec(`killall -9 ${processName}`).on('exit', (code) => {
    if (code === 0) {
      console.log(`Pwned ${processName}, this app is not allowed!`);
    }
  });
}

function main() {
  for (const processName of processNames) {
    killAllByProcessName(processName);
  }
}

setInterval(main, 1000);
