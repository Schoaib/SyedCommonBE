
export function capitalizeFirstLetter (string){
	return string.charAt(0).toUpperCase() + string.slice(1);
}

import winston from 'winston';

const logger = new winston.Logger({
	transports: [
		new winston.transports.Console({
			level: 'debug',
			handleExceptions: true,
			json: false,
			colorize: true
		},{
			level: 'error',
			handleExceptions: true,
			json: false,
			colorize: true
		},{
			level: 'info',
			handleExceptions: true,
			json: false,
			colorize: true
		})
	],
	exitOnError: false
});

export default logger;
