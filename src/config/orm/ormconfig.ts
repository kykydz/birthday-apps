import { SqliteConnectionOptions } from 'typeorm/driver/sqlite/SqliteConnectionOptions';
import { User } from '../../entity/user';
import { Greeting } from '../../entity/greeting';

export const sqliteOptions: SqliteConnectionOptions = {
	type: 'sqlite',
	database: 'database.sqlite',
	synchronize: true,
	logging: false,
	entities: [User, Greeting],
	migrationsTableName: 'migration_record',
	migrations: ['../../migration/**/*.ts'],
};
