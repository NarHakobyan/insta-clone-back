import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    BaseEntity,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne
} from 'typeorm';
import { User } from './User';

@Entity('stories')
export class Story extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: number;

    @Column()
    title: string;

    @Column()
    description: string;

    @Column({ nullable: true })
    image: string;

    @ManyToOne(() => User, author => author.stories)
    author: User;

    @CreateDateColumn({
        type: 'timestamp without time zone'
    })
    createdDate: Date;

    @UpdateDateColumn({
        type: 'timestamp without time zone'
    })
    updatedDate: Date;
}
