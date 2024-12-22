import {Request, Response} from 'express';
import {inject, injectable} from 'inversify';
import {BaseController} from '../../../controller/base-controller.js';
import {Logger} from '../../../logger/logger.interface.js';
import {Component} from '../../../types/component.enum.js';
import {HttpMethod} from '../../../types/http-method.enum.js';
import {OfferService} from '../offer-service.interface.js';
import {OfferRdo} from '../rdo/offer.rdo.js';
import {fillDTO} from '../../../helpers/fillDTO.js';
import UpdateOfferDto from '../dto/update-offer.dto.js';
import {ParamOfferId} from '../../../types/param-offer-id.js';
import CreateOfferDto from '../dto/create-offer.dto.js';
import {CommentService} from '../../comment/comment-service.interface.js';
import {CommentRdo} from '../../comment/rdo/comment.rdo.js';
import {ValidateDtoMiddleware} from '../../../middleware/validate-dto.middleware.js';
import {ValidateObjectIdMiddleware} from '../../../middleware/validate-objectId.middleware.js';
import {DocumentExistsMiddleware} from '../../../middleware/document-exists.middleware.js';
import {PrivateRouteMiddleware} from '../../../middleware/private-root.middleware.js';
import {UnknownRecord} from '../../../types/unknown-record.type.js';
import {UserService} from '../../user/user-service.interface.js';
import {RestSchema} from '../../../config/rest.schema.js';
import {Config} from '../../../config/config.interface.js';
import {FavoriteOfferDto} from '../dto/offer-favorite-dto.js';
import {ParamsCity} from '../../../types/city-params.type.js';

@injectable()
export default class OfferController extends BaseController {
  constructor(
    @inject(Component.Logger) logger: Logger,
    @inject(Component.OfferService) private readonly offersService: OfferService,
    @inject(Component.CommentService) private readonly commentService: CommentService,
    @inject(Component.UserService) private readonly userService: UserService,
    @inject(Component.Config) configService: Config<RestSchema>,
  ) {
    super(logger, configService);

    this.logger.info('Register routes for OfferController');

    this.addRoute({path: '/', method: HttpMethod.Get, handler: this.index});
    this.addRoute({
      path: '/',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateDtoMiddleware(CreateOfferDto),
      ]
    });
    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Get,
      handler: this.show,
      middlewares: [
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offersService, 'Offer', 'offerId'),
      ]
    });
    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Delete,
      handler: this.delete,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offersService, 'Offer', 'offerId'),
      ]
    });
    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Patch,
      handler: this.update,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('offerId'),
        new ValidateDtoMiddleware(UpdateOfferDto),
        new DocumentExistsMiddleware(this.offersService, 'Offer', 'offerId'),
      ]
    });
    this.addRoute({
      path: '/:offerId/comments',
      method: HttpMethod.Get,
      handler: this.getComments,
      middlewares: [new ValidateObjectIdMiddleware('offerId')]
    });
    this.addRoute({
      path: '/users/favorite',
      method: HttpMethod.Get,
      handler: this.showFavorites,
      middlewares:[new PrivateRouteMiddleware()]
    });
    this.addRoute({
      path: '/premium/:city',
      method: HttpMethod.Get,
      handler: this.showPremium
    });
    this.addRoute({
      path: '/:offerId/favorite',
      method: HttpMethod.Post,
      handler: this.addFavorite,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offersService, 'Offer', 'offerId')
      ]
    });
    this.addRoute({
      path: '/:offerId/favorite',
      method: HttpMethod.Delete,
      handler: this.deleteFavorite,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offersService, 'Offer', 'offerId')
      ]
    });
  }

  public async index(_req: Request, res: Response) {
    const offers = await this.offersService.find();
    this.ok(res, fillDTO(OfferRdo, offers));
  }

  public async create({body, user}: Request<UnknownRecord, UnknownRecord, CreateOfferDto>, res: Response): Promise<void> {
    const result = await this.offersService.create({...body, userId: user.id});

    this.created(res, fillDTO(OfferRdo, result));
  }

  public async delete({params}: Request<ParamOfferId>, res: Response): Promise<void> {
    const {offerId} = params;
    const offer = await this.offersService.deleteById(offerId);

    await this.commentService.deleteByOfferId(offerId);
    this.noContent(res, offer);
  }

  public async update({body, params}: Request<ParamOfferId, UnknownRecord, UpdateOfferDto>, res: Response): Promise<void> {
    const updatedOffer = await this.offersService.updateById(params.offerId, body);

    this.ok(res, fillDTO(OfferRdo, updatedOffer));
  }

  public async show({params}: Request<ParamOfferId>, res: Response): Promise<void>{
    const {offerId} = params;
    const offer = await this.offersService.findById(offerId);

    this.ok(res, fillDTO(OfferRdo, offer));
  }

  public async showFavorites(req: Request, _res: Response): Promise<void> {
    const {user} = req;
    const offers = await this.userService.findFavoriteOffers(user.id);

    this.ok(_res, fillDTO(FavoriteOfferDto, offers));
  }

  public async showPremium({params}: Request<ParamsCity>, res: Response): Promise<void> {
    const offers = await this.offersService.findPremiumByCity(params.city);

    this.ok(res, fillDTO(OfferRdo, offers));
  }

  public async addFavorite({params: {offerId}, user: {id: userId}}: Request<ParamOfferId>, res: Response): Promise<void> {
    await this.offersService.addFavorite(offerId, userId);

    this.noContent(res, {});
  }

  public async deleteFavorite({params: {offerId}, user: {id: userId}}: Request<ParamOfferId>, res: Response): Promise<void> {
    await this.offersService.deleteFavorite(offerId, userId);

    this.noContent(res, {});
  }

  public async getComments({params}: Request<ParamOfferId, UnknownRecord, UnknownRecord>, res: Response): Promise<void> {
    const comments = await this.commentService.findByOfferId(params.offerId);

    this.ok(res, fillDTO(CommentRdo, comments));
  }
}
