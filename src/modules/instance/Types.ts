import {Field, InputType, Int} from 'type-graphql';

@InputType()
export class CreateInstanceInput {
  @Field(() => Int)
  templateId: number;

  @Field()
  timed: boolean;

  @Field()
  infiniteQuestions: boolean;
}
