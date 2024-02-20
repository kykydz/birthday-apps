import { BaseRepository } from './base';
import { ILogger } from '../utils/logger';
import { DataSource } from 'typeorm';
import { Greeting } from '../entity/greeting';

export class GreetingRepository extends BaseRepository<Greeting> {
	constructor(dataSource: DataSource, logger: ILogger) {
		super(dataSource, Greeting, logger);
	}

	// add custom method
}
