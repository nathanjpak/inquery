import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  ManyToOne,
  JoinTable,
} from 'typeorm';
import {Field, ID, Int, ObjectType} from 'type-graphql';
import {Instance} from './Instance';

@ObjectType()
@Entity()
export class Score extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => Int)
  @Column()
  instanceId: number;

  @Field(() => Instance)
  @ManyToOne(() => Instance, (instance: Instance) => instance.scores)
  @JoinTable()
  instance: Instance;

  @Field(() => String)
  @Column()
  testTaker: string;

  @Field(() => Int)
  @Column()
  questionsAnswered: number;

  @Field(() => Int)
  @Column()
  questionsCorrect: number;
}
