import {Resolver, Mutation, Arg, Ctx} from 'type-graphql';
import {Instance} from '../../entity/Instance';
import {Template} from '../../entity/Template';

import {User} from '../../entity/User';
import {MyContext} from '../../types/MyContext';

@Resolver()
export class InstanceResolver {
  @Mutation(() => Instance, {nullable: true})
  async createInstance(
    @Arg('templateId') templateId: number,
    @Arg('timed') timed: boolean,
    @Arg('infiniteQuestions') infiniteQuestions: boolean,
    @Ctx() ctx: MyContext
  ): Promise<Instance | null> {
    const currentUser = await User.findOneBy({id: ctx.req.session.userId});
    if (!currentUser) return null;

    const currentTemplate = await Template.findOneBy({id: templateId});
    if (!currentTemplate) return null;

    const instance = await Instance.create({
      hostId: currentUser.id,
      code: genCode(),
      templateId: templateId,
      template: currentTemplate,
      timed: !!timed,
      infiniteQuestions: !!infiniteQuestions,
      lastActive: new Date(),
    }).save();

    return instance;
  }
}

const genCode = () => {
  let result = '';
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < 6) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
};
