import {Resolver, Mutation, Arg, Ctx} from 'type-graphql';

import {Template} from '../../entity/Template';
import {MyContext} from '../../types/MyContext';
import {CreateTemplateInput} from './Types';

@Resolver()
export class TemplateResolver {
  @Mutation(() => Template, {nullable: true})
  async createTemplate(
    @Arg('input') problems: CreateTemplateInput,
    @Ctx() ctx: MyContext
  ): Promise<Template | null> {
    if (!ctx.req.session.userId) return null;

    const template = await Template.create({
      problems: JSON.stringify(problems),
      ownerId: ctx.req.session.userId,
    }).save();

    return template;
  }
}
