import {
	Repository,
	DeepPartial,
	DeleteResult,
	FindOptionsWhere,
	EntityTarget,
	DataSource,
	FindOptions,
	FindOneOptions,
} from 'typeorm';
import { ILogger } from '../utils/logger';
import { IBaseRepository } from './base.interface';

export class BaseRepository<T extends Record<string, any>>
	implements IBaseRepository<T>
{
	public repository: Repository<T>; // Define repository property
	public logger: ILogger;

	constructor(
		dataSource: DataSource,
		entity: EntityTarget<T>,
		logger: ILogger
	) {
		// Initialize repository with getRepository function
		this.repository = dataSource.getRepository(entity);
		// Initialize logger if provided
		this.logger = logger;
	}

	async getAll(): Promise<T[]> {
		return await this.repository.find({});
	}

	async findOne(query: FindOneOptions<T>): Promise<T> {
		return await this.repository.findOne(query);
	}

	async save(data: DeepPartial<T>): Promise<T> {
		try {
			const result = await this.repository.save(data);
			return result;
		} catch (error) {
			this.logger.error('Failed to create entity', data, error);
			throw new Error('Failed to create entity');
		}
	}

	async update(
		query: FindOptionsWhere<T>,
		data: Partial<T>
	): Promise<DeleteResult> {
		try {
			const result = await this.repository.update(query, data);
			return result;
		} catch (error) {
			this.logger.error('Failed to delete entity', query, error);
			throw new Error('Failed to delete entity');
		}
	}

	async delete(query: FindOptionsWhere<T>): Promise<DeleteResult> {
		try {
			const result = await this.repository.delete(query);
			return result;
		} catch (error) {
			this.logger.error('Failed to delete entity', query, error);
			throw new Error('Failed to delete entity');
		}
	}
}
