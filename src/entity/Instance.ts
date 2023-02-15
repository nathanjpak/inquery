import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  ManyToOne,
  JoinColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import {User} from './User';
import {Template} from './Template';
import {Field, ID, Int, ObjectType} from 'type-graphql';

@ObjectType()
@Entity()
export class Instance extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => User)
  @ManyToOne(() => User, (user: User) => user.hostedInstances)
  @JoinColumn()
  host: User;

  @Field(() => [User])
  @ManyToMany(() => User, (user: User) => user.takenInstances)
  @JoinTable()
  participants: User[];

  @Field(() => Template)
  @ManyToOne(() => Template, (template: Template) => template.instances)
  @JoinTable()
  template: Template;

  @Field(() => [Int])
  @Column('int', {array: true})
  scores: number[];

  @Field(() => String)
  @Column('text')
  code: string;

  @Field()
  @Column()
  isActive: boolean;
}
