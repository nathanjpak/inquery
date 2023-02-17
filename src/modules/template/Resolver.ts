import {Resolver, Mutation, Arg, Ctx, Query} from 'type-graphql';

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

  @Query(() => Template, {nullable: true})
  async findTemplate(@Arg('id') id: number): Promise<Template | null> {
    const template = await Template.findOneBy({id: id});

    return template;
  }

  // @Query(() => Template, {nullable: true})
  // async findTemplatesByUser(@Ctx() ctx: MyContext): Promise<Template[] | null> {
  //   if (!ctx.req.session.userId) return null;

  //   const templates = Template.findBy({ownerId: ctx.req.session.userId});

  //   return templates;
  // }
}
