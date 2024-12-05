import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    userName: String;

    @Column()
    email: String;

    @Column()
    password: String;

    @CreateDateColumn({type: 'timestamp'})
    createdAt: Date;
}
