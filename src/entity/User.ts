import {Field, ID, ObjectType} from 'type-graphql';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  OneToMany,
  ManyToMany,
} from 'typeorm';
import {Instance} from './Instance';
import {Template} from './Template';

@ObjectType()
@Entity()
export class User extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column('text', {unique: true})
  username: string;

  @Field()
  @Column('text', {unique: true})
  email: string;

  @Column()
  password: string;

  @Field(() => [Template])
  @OneToMany(() => Template, (template: Template) => template.owner)
  templates: Template[];

  @Field(() => [Instance])
  @OneToMany(() => Instance, (instance: Instance) => instance.host)
  hostedInstances: Instance[];

  @Field(() => [Instance])
  @ManyToMany(() => Instance, (instance: Instance) => instance.participants)
  takenInstances: Instance[];
}
