import {Field, ID, ObjectType} from 'type-graphql';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  OneToMany,
} from 'typeorm';
import {Instance} from './Instance';
import {Score} from './Score';
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

  @OneToMany(() => Template, (template: Template) => template.owner)
  templates: Template[];

  @OneToMany(() => Instance, (instance: Instance) => instance.host)
  hostedInstances: Instance[];

  @OneToMany(() => Score, (score: Score) => score.testTaker)
  takenTests: Score[];
}
