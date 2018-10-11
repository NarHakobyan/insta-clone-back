import { Crypto } from 'utils/crypto';
import { Exclude } from 'class-transformer';
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    BaseEntity,
    BeforeInsert,
    BeforeUpdate,
    CreateDateColumn,
    UpdateDateColumn
} from 'typeorm';

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

    @Column()
    age: number;

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
        console.log('BeforeUpdate', args, this);
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
