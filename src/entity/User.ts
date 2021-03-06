import { Exclude } from 'class-transformer';
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    BaseEntity,
    BeforeInsert,
    BeforeUpdate,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
    JoinColumn,
    Generated
} from 'typeorm';

import { Crypto } from '../utils/crypto';
import { logger } from '../utils/logger';
import { Story } from './Story';

@Entity('users')
export class User extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: number;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column({ unique: true })
    email: string;

    @Column()
    @Exclude()
    password: string;

    @Column({
        type: 'timestamp without time zone'
    })
    dob: Date;

    @OneToMany(() => Story, story => story.author)
    @JoinColumn()
    stories: Story[];

    @Column({ nullable: true })
    @Generated('uuid')
    activationToken: string;

    @CreateDateColumn({
        type: 'timestamp without time zone'
    })
    createdDate: Date;

    @UpdateDateColumn({
        type: 'timestamp without time zone'
    })
    updatedDate: Date;

    @BeforeInsert()
    async beforeInsert() {
        this.password = await Crypto.generateHash(this.password);
    }

    @BeforeUpdate()
    async beforeUpdate(...args: any[]) {
        logger.info('BeforeUpdate', args, this);
    }

    generateToken(): Promise<string> {
        return Crypto.encodeJwt({
            id: this.id
        });
    }

    comparePassword(password: string): Promise<boolean> {
        return Crypto.compareHash(password, this.password);
    }
}
