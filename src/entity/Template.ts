import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import {User} from './User';
import {Instance} from './Instance';
import {Field, ID, ObjectType} from 'type-graphql';

@ObjectType()
@Entity()
export class Template extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => User)
  @ManyToOne(() => User, (user: User) => user.templates)
  @JoinColumn()
  owner: User;

  @Field(() => [Instance])
  @OneToMany(() => Instance, (instance: Instance) => instance.template)
  instances: Instance[];

  @Field(() => [String])
  @Column('text', {array: true, nullable: true})
  problems: string[];
}
