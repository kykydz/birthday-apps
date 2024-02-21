import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	CreateDateColumn,
	UpdateDateColumn,
	ManyToOne,
	JoinColumn,
	Index,
} from 'typeorm';
import { User } from './user';
import { IsEnum } from 'class-validator';
import { Type } from 'class-transformer';

export enum GreetingType {
	BIRTHDAY = 'BIRTHDAY',
	ANNIV = 'ANNIV',
	MARRIED = 'MARRIED',
}

export enum GreetingStatus {
	PROGRESS = 'PROGRESS',
	SUCCESS = 'SUCCESS',
	FAILED = 'FAILED',
}

@Entity()
@Index(['user', 'greetingDate'], { unique: true })
export class Greeting {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@ManyToOne(() => User, (user) => user.greetings)
	@JoinColumn({ name: 'user_id' })
	user: User;

	@Column()
	@IsEnum(GreetingType)
	@Type(() => String)
	type: GreetingType;

	@Column({ type: 'date' })
	greetingDate: Date;

	@Column()
	@IsEnum(GreetingStatus)
	@Type(() => String)
	status: GreetingStatus;

	@CreateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
	created: Date;

	@UpdateDateColumn({
		type: 'datetime',
		default: () => 'CURRENT_TIMESTAMP',
		onUpdate: 'CURRENT_TIMESTAMP',
	})
	updated: Date;

	@Column({ nullable: true })
	raw_response?: string | null;
}
