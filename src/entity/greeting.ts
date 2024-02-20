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

@Entity()
@Index(['user', 'greetingDate'], { unique: true })
export class Greeting {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@ManyToOne(() => User, (user) => user.greetings)
	@JoinColumn({ name: 'user_id' })
	user: User;

	@Column({ type: 'enum', enum: ['BIRTHDAY', 'ANNIV', 'MARRIED'] })
	type: 'BIRTHDAY' | 'ANNIV' | 'MARRIED';

	@Column({ type: 'date' })
	greetingDate: Date;

	@Column({
		type: 'enum',
		enum: ['PROGRESS', 'SUCCESS', 'FAILED'],
		default: 'PROGRESS',
	})
	status: 'PROGRESS' | 'SUCCESS' | 'FAILED';

	@CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
	created: Date;

	@UpdateDateColumn({
		type: 'timestamp',
		default: () => 'CURRENT_TIMESTAMP',
		onUpdate: 'CURRENT_TIMESTAMP',
	})
	updated: Date;

	// Other columns and methods...
}
