import {Resolver, Mutation, Arg} from 'type-graphql';
import bcrypt from 'bcryptjs';

import {User} from '../../entity/User';
import {RegisterInput} from './register/RegisterInput';

@Resolver(User)
export class RegisterResolver {
  @Mutation(() => User)
  async register(
    @Arg('input') {email, password, username}: RegisterInput
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
