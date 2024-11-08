import {defaultClasses, getModelForClass, modelOptions, prop, Ref} from '@typegoose/typegoose';
import {OfferEntity} from '../offer/offer.entity.js';
import {UserEntity} from '../user/user.entity.js';

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export interface CommentEntity extends defaultClasses.Base {
}

@modelOptions({
  schemaOptions: {
    collection: 'comments'
  }
})

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class CommentEntity extends defaultClasses.TimeStamps {
  @prop({
    trim: true,
    required: true,
    min: [5, 'Min length for text is 5'],
    max: [1024, 'Min length for text is 1024'],
  })
  public text!: string;

  @prop({
    ref: OfferEntity,
    required: true
  })
  public offerId: Ref<OfferEntity>;

  @prop({
    ref: UserEntity,
    required: true,
  })
  public userId: Ref<UserEntity>;

  @prop({required: true})
  public datePublication!: Date;

  @prop({required: true})
  public rating!: number;
}

export const CommentModel = getModelForClass(CommentEntity);
