const {Signale} = require('signale');

const options = {
  scope: 'Dev mode'
};

const global = new Signale(options);
const currentTimes = new Date()
const padL = (nr, length = 2, chr = `0`) => `${nr}`.padStart(length, chr);

global.start('Starting Dev mode...');
global.success('Successful Dev mode started at :');
global.success(`${padL(currentTimes.getMonth()+1)}/${padL(currentTimes.getDate())}/${currentTimes.getFullYear()} @ ${padL(currentTimes.getHours())}:${padL(currentTimes.getMinutes())}:${padL(currentTimes.getSeconds())}`);
global.info('Dev mode is running on   :   ', 'http://localhost:3000');
global.info('Dev mode is using API on :   ', 'https://devback.fafpro.fr');
global.info('App version : 1.0.0-beta3');
global.complete('\r\n    ____   ____ _  __  ____ __ __\r\n   \/ __ \\ \/  _\/| |\/ \/ \/  _\/\/ \/\/_\/\r\n  \/ \/_\/ \/ \/ \/  |   \/  \/ \/ \/ ,<   \r\n \/ ____\/_\/ \/  \/   | _\/ \/ \/ \/| |  \r\n\/_\/    \/___\/ \/_\/|_|\/___\/\/_\/ |_|  \r\n                                 \r\n');