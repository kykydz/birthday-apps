import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	CreateDateColumn,
	UpdateDateColumn,
	OneToMany,
} from 'typeorm';
import { uuid } from 'uuidv4';
import { Greeting } from './greeting';

@Entity()
export class User {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column()
	first_name: string;

	@Column()
	last_name: string;

	@Column({ type: 'datetime' })
	birthdate: Date;

	@Column()
	time_zone_name: string;

	@Column()
	tz_offset: Number;

	@Column()
	location: string;

	@CreateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
	created: Date;

	@UpdateDateColumn({
		type: 'datetime',
		default: () => 'CURRENT_TIMESTAMP',
		onUpdate: 'CURRENT_TIMESTAMP',
	})
	updated: Date;

	@OneToMany(() => Greeting, (greeting) => greeting.user)
	greetings: Greeting[];
}
