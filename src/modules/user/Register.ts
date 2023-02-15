import {Resolver, Query, Mutation, Arg} from 'type-graphql';
import * as bcrypt from 'bcryptjs';

import {User} from '../../entity/User';

@Resolver(User)
export class RegisterResolver {
  @Query(() => String)
  async hello() {
    return 'Hello world';
  }

  @Mutation(() => User)
  async register(
    @Arg('email') email: string,
    @Arg('password') password: string,
    @Arg('username', {nullable: true}) username: string
  ): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      email: email,
      password: hashedPassword,
      username: username,
    }).save();

    return user;
  }
}
