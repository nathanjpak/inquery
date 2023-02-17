import {IsJSON} from 'class-validator';
import {Field, InputType} from 'type-graphql';

@InputType()
export class CreateTemplateInput {
  @Field(() => String)
  @IsJSON()
  problems: string;
}
