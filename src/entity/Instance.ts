import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  ManyToOne,
  JoinColumn,
  JoinTable,
  OneToMany,
} from 'typeorm';
import {User} from './User';
import {Template} from './Template';
import {Field, ID, Int, ObjectType} from 'type-graphql';
import {Score} from './Score';

@ObjectType()
@Entity()
export class Instance extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => Int)
  @Column()
  hostId: number;

  @Field(() => User)
  @ManyToOne(() => User, (user: User) => user.hostedInstances)
  @JoinColumn()
  host: User;

  @Field(() => Int)
  @Column()
  templateId: number;

  @Field(() => Template)
  @ManyToOne(() => Template, (template: Template) => template.instances)
  @JoinTable()
  template: Template;

  @Field(() => [Score])
  @OneToMany(() => Score, (score: Score) => score.instance)
  scores: Score[];

  @Field(() => String)
  @Column('text')
  code: string;

  @Field()
  @Column()
  infiniteQuestions: boolean;

  @Field()
  @Column()
  timed: boolean;

  @Field(() => String)
  @Column()
  lastActive: Date;
}
