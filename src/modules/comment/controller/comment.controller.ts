import {inject, injectable} from 'inversify';
import {Response, Request} from 'express';
import {StatusCodes} from 'http-status-codes';
import {BaseController} from '../../../controller/base-controller.js';
import {Component} from '../../../types/component.enum.js';
import {CommentService} from '../comment-service.interface.js';
import {OfferService} from '../../offer/offer-service.interface.js';
import {Logger} from '../../../logger/logger.interface.js';
import {HttpMethod} from '../../../types/http-method.enum.js';
import CreateCommentDto from '../dto/create-comment.dto.js';
import {HttpError} from '../../../errors/http-error.js';
import {CommentRdo} from '../rdo/comment.rdo.js';
import {fillDTO} from '../../../helpers/fillDTO.js';

@injectable()
export class CommentController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.CommentService) private readonly commentService: CommentService,
    @inject(Component.OfferService) private readonly offerService: OfferService,
  ) {
    super(logger);

    this.logger.info('Register routes for CommentController…');
    this.addRoute({ path: '/', method: HttpMethod.Post, handler: this.create });
  }

  public async create(
    {body}: Request<Record<string, unknown>, Record<string, unknown>, CreateCommentDto>,
    res: Response
  ): Promise<void> {
    if (!await this.offerService.exists(body.offerId)) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Offer with id ${body.offerId} not found.`,
        'CommentController'
      );
    }

    const comment = await this.commentService.create(body);
    await this.offerService.incCommentCount(body.offerId);
    this.created(res, fillDTO(CommentRdo, comment));
  }
}
