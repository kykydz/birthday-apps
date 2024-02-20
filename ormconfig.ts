import { SqliteConnectionOptions } from 'typeorm/driver/sqlite/SqliteConnectionOptions';
import { User } from './src/entity/user';

export const sqliteOptions: SqliteConnectionOptions = {
	type: 'sqlite',
	database: 'database.sqlite',
	synchronize: true,
	logging: true,
	entities: [User],
	migrationsTableName: 'migration_record',
	migrations: ['../../migration/**/*.ts'],
};
