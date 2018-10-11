import * as bcrypt from 'bcrypt';
import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, BeforeInsert, BeforeUpdate } from 'typeorm';

@Entity('users')
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column()
    email: string;

    @Column()
    password: string;

    @Column()
    age: number;

    @BeforeInsert()
    async beforeInsert() {
        this.password = await bcrypt.hash(this.password, 10);
    }

    @BeforeUpdate()
    async beforeUpdate(...args: any[]) {
        console.log('BeforeUpdate', args, this);
    }
}
