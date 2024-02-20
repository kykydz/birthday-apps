import cron from 'node-cron';
import { Greeting } from '../service/greeting';
import { AppDataSource } from '../config/orm/typorm';
import { ENV } from '../config/environment';
import { Logger } from '../utils/logger';
import { birthdayGreetingCron } from './birthday-greeting';

(async () => {
	const logger = new Logger(ENV);
	const appDatasource = await new AppDataSource(logger).initDatasource();

	// // Define your cron job
	// const birthDayEmail = cron.schedule('* * * * *', async () => {
	// 	console.log('Cron job is birthDayEmail running!');
	// 	return await birthdayGreetingCron(appDatasource, logger);
	// });

	// // Start the cron job
	// birthDayEmail.start();

	return await birthdayGreetingCron(appDatasource, logger);
})();
