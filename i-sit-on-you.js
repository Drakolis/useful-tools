const {exec} = require('node:child_process');

const allowStartHour = 10;
const allowEndHour = 18;
const processNames = ['Slack'];

const victims = [];

function killAllByProcessName(processName) {
	exec(`killall -9 ${processName}`).on('exit', (code) => {
		if (code === 0) {
			console.log(`Pwned ${processName}, this app is not allowed right now!`);
			if (!victims.includes(processName)) {
				victims.push(processName);
			}
		}
	});
}

function restartVictims() {
	while (victims.length > 0) {
		const victim = victims.pop();
		console.log(`Resurrecting ${victim}, this app was killed during hunt!`);
		const macosStartScript = `open /Applications/${victim}.app/`;
		exec(macosStartScript);
	}
}

function main() {
	const timeNow = new Date();
	if (
		timeNow.getHours() <= allowStartHour ||
		timeNow.getHours() >= allowEndHour
	) {
		for (const processName of processNames) {
			killAllByProcessName(processName);
		}
	} else if (victims.length > 0) {
		restartVictims();
	}
}

setInterval(main, 1000);
