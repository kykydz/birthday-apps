import { FindOptionsWhere, Repository } from 'typeorm';
import { User } from '../entity/user';
import { uuid } from 'uuidv4';
import { UserRepository } from '../repository/user';
import { removeUndefinedAndNull } from '../utils/object-modifier';

export class UserService {
	protected repository: UserRepository;

	constructor(repository: UserRepository) {
		this.repository = repository;
	}

	async create(data: any) {
		const userData = {
			id: String(uuid()),
			birthdate: data.birthdate,
			first_name: data.firstName,
			last_name: data.lastName,
			location: data.location,
			time_zone_name: data.timeZoneName,
			tz_offset: data.tzOffset,
		};

		const result = await this.repository.save(userData);
		return result;
	}

	async delete(data: any) {
		const query: FindOptionsWhere<User> = {
			id: data.id,
		};

		const result = await this.repository.delete(query);
		return result;
	}

	async update(id: string, data: any) {
		const query: FindOptionsWhere<User> = {
			id,
		};
		const dataToUpdate: Partial<User> = removeUndefinedAndNull({
			birthdate: data.birthdate,
			first_name: data.firstName,
			last_name: data.lastName,
			location: data.location,
		});

		const result = await this.repository.update(query, dataToUpdate);
		return result;
	}
}
