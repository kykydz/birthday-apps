import { DataSource } from 'typeorm';
import { UserRepository } from '../repository/user';
import { GreetingService } from '../service/greeting';
import { ILogger } from '../utils/logger';
import { GreetingRepository } from '../repository/greeting';

export const birthdayGreetingCron = async (
	dataSource: DataSource,
	logger: ILogger
) => {
	const userRepository = new UserRepository(dataSource, logger);
	const greetingRepository = new GreetingRepository(dataSource, logger);

	const greeting = new GreetingService(userRepository, greetingRepository);

	return await greeting.birthdayEmail();
};
