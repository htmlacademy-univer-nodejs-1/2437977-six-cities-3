import {StatusCodes} from 'http-status-codes';
import {Request, Response} from 'express';
import {inject, injectable} from 'inversify';
import {BaseController} from '../../../controller/base-controller.js';
import {Logger} from '../../../logger/logger.interface.js';
import {Component} from '../../../types/component.enum.js';
import {HttpMethod} from '../../../types/http-method.enum.js';
import {HttpError} from '../../../errors/http-error.js';
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

@injectable()
export default class OfferController extends BaseController {
  constructor(
    @inject(Component.Logger) logger: Logger,
    @inject(Component.OfferService) private readonly offersService: OfferService,
    @inject(Component.CommentService) private readonly commentService: CommentService,
  ) {
    super(logger);

    this.logger.info('Register routes for OfferController');

    this.addRoute({path: '/', method: HttpMethod.Get, handler: this.index});
    this.addRoute({
      path: '/',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [new ValidateDtoMiddleware(CreateOfferDto)]
    });
    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Get,
      handler: this.show,
      middlewares: [new ValidateObjectIdMiddleware('offerId')]
    });
    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Delete,
      handler: this.delete,
      middlewares: [new ValidateObjectIdMiddleware('offerId')]
    });
    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Patch,
      handler: this.update,
      middlewares: [
        new ValidateObjectIdMiddleware('offerId'),
        new ValidateDtoMiddleware(UpdateOfferDto),
      ]
    });
    this.addRoute({
      path: '/:offerId/comments',
      method: HttpMethod.Get,
      handler: this.getComments,
      middlewares: [new ValidateObjectIdMiddleware('offerId')]
    });
  }

  public async index(_req: Request, res: Response): Promise<void> {
    const offers = await this.offersService.find();
    const offersToRes = fillDTO(OfferRdo, offers);

    this.ok(res, offersToRes);
  }

  public async create({body}: Request<Record<string, unknown>, Record<string, unknown>, CreateOfferDto>, res: Response): Promise<void> {
    const result = await this.offersService.create(body);

    this.created(res, fillDTO(OfferRdo, result));
  }

  public async delete({params}: Request<ParamOfferId>, res: Response): Promise<void> {
    const {offerId} = params;
    const offer = await this.offersService.deleteById(offerId);

    if (!offer) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Offer with id ${offerId} not found.`,
        'OfferController'
      );
    }

    await this.commentService.deleteByOfferId(offerId);
    this.noContent(res, offer);
  }

  public async update({body, params}: Request<ParamOfferId, unknown, UpdateOfferDto>, res: Response): Promise<void> {
    const updatedOffer = await this.offersService.updateById(params.offerId, body);

    if (!updatedOffer) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Offer with id ${params.offerId} not found.`,
        'OfferController'
      );
    }

    this.ok(res, fillDTO(OfferRdo, updatedOffer));
  }

  public async show(_req: Request, _res: Response): Promise<void> {
    throw new HttpError(
      StatusCodes.NOT_IMPLEMENTED,
      'Not implemented',
      'OfferController'
    );
  }

  public async getComments({ params }: Request<ParamOfferId>, res: Response): Promise<void> {
    if (!await this.offersService.exists(params.offerId)) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Offer with id ${params.offerId} not found.`,
        'OfferController'
      );
    }

    const comments = await this.commentService.findByOfferId(params.offerId);
    this.ok(res, fillDTO(CommentRdo, comments));
  }
}
