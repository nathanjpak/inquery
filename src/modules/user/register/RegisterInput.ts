import {IsEmail, Length, Matches} from 'class-validator';
import {Field, InputType} from 'type-graphql';

@InputType()
export class RegisterInput {
  @Field()
  @IsEmail()
  email: string;

  @Field()
  @Length(8, 255)
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/, {
    message: 'Password is too weak.',
  })
  password: string;

  @Field()
  @Length(4, 255)
  username: string;
}
