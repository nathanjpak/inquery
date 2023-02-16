import {Resolver, Query, Ctx} from 'type-graphql';

import {User} from '../../entity/User';
import {MyContext} from '../../types/MyContext';

@Resolver(User)
export class CurrentUserResolver {
  @Query(() => User, {nullable: true})
  async currentUser(@Ctx() ctx: MyContext): Promise<User | null> {
    if (!ctx.req.session.userId) return null;

    return User.findOneBy({id: ctx.req.session.userId});
  }
}
