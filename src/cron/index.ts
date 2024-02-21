import cron from 'node-cron';
import { AppDataSource } from '../config/orm/typorm';
import { ENV } from '../config/environment';
import { Logger } from '../utils/logger';
import { birthdayGreetingCron } from './birthday-greeting';
import { UserRepository } from '../repository/user';
import { GreetingRepository } from '../repository/greeting';
import { Greeting } from '../entity/greeting';
import { GreetingService } from '../service/greeting';

(async () => {
	const logger = new Logger(ENV);
	try {
		const appDatasource = await new AppDataSource(logger).initDatasource();
		const userRepository = new UserRepository(appDatasource, logger);
		const greetingRepository = new GreetingRepository(appDatasource, logger);

		const greetingService = new GreetingService(
			userRepository,
			greetingRepository,
			logger
		);

		// Define your cron job
		// https://crontab.guru/every-1-hour
		const birthDayEmail = cron.schedule('* * * * *', async () => {
			logger.info('Cron job "birthDayEmail" is running!');
			try {
				await birthdayGreetingCron(appDatasource, logger);
				logger.info('Cron job "birthDayEmail" completed successfully.');
			} catch (error) {
				logger.error('Error executing cron job "birthDayEmail": ', error);
			}
		});

		// self heal for pending message
		await greetingService.automatePendingGreeting();

		// Start the cron job
		birthDayEmail.start();

		logger.info('Cron job scheduler initialized successfully.');
		return Promise.resolve();
	} catch (error) {
		logger.error('Error initializing cron job scheduler:', error);
		process.exit(1);
	}
})();
