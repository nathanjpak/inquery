import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  ManyToOne,
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

  @Field()
  @Column()
  ownerId: number;

  // @Field(() => User)
  @ManyToOne(() => User, (user: User) => user.templates)
  owner: User;

  @Field(() => [Instance])
  @OneToMany(() => Instance, (instance: Instance) => instance.template)
  instances: Instance[];

  @Field(() => String)
  @Column('text')
  problems: string;
}
