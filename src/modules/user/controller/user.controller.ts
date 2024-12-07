import {inject, injectable} from 'inversify';
import {Response, Request} from 'express';
import {Config} from 'convict';
import {StatusCodes} from 'http-status-codes';
import {BaseController} from '../../../controller/base-controller.js';
import {Logger} from '../../../logger/logger.interface.js';
import {Component} from '../../../types/component.enum.js';
import {HttpMethod} from '../../../types/http-method.enum.js';
import {RestSchema} from '../../../config/rest.schema.js';
import CreateUserDto from '../dto/create-user.dto.js';
import {UserService} from '../user-service.interface.js';
import {UserRdo} from '../rdo/user.rdo.js';
import {HttpError} from '../../../errors/http-error.js';
import {fillDTO} from '../../../helpers/fillDTO.js';
import {UploadFileMiddleware} from '../../../middleware/upload-file.middleware.js';
import {ValidateObjectIdMiddleware} from '../../../middleware/validate-objectId.middleware.js';

@injectable()
export class UserController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.UserService) private readonly userService: UserService,
    @inject(Component.Config) private readonly configService: Config<RestSchema>,
  ) {
    super(logger);
    this.logger.info('Register routes for UserController');
    this.addRoute({path: '/register', method: HttpMethod.Post, handler: this.create});
    this.addRoute({path: '/login', method: HttpMethod.Post, handler: this.login});
    this.addRoute({
      path: '/:userId/avatar',
      method: HttpMethod.Post,
      handler: this.uploadAvatar,
      middlewares: [
        new ValidateObjectIdMiddleware('userId'),
        new UploadFileMiddleware(this.configService.get('UPLOAD_DIRECTORY'), 'avatar'),
      ]
    });
  }

  public async create(
    {body}: Request<Record<string, unknown>, Record<string, unknown>, CreateUserDto>,
    res: Response,
  ): Promise<void> {
    const existsUser = await this.userService.findByEmail(body.email);

    if (existsUser) {
      throw new HttpError(
        StatusCodes.CONFLICT,
        `User with email «${body.email}» exists.`,
        'UserController'
      );
    }

    const result = await this.userService.create(body, this.configService.get('SALT'));
    this.created(res, fillDTO(UserRdo, result));
  }

  public async login(
    { body }:Request<Record<string, unknown>, Record<string, unknown>, CreateUserDto>,
    _res: Response,
  ): Promise<void> {
    const existsUser = await this.userService.findByEmail(body.email);

    if (!existsUser) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        `User with email ${body.email} not found.`,
        'UserController',
      );
    }

    throw new HttpError(
      StatusCodes.NOT_IMPLEMENTED,
      'Not implemented',
      'UserController',
    );
  }

  public async uploadAvatar(req: Request, res: Response) {
    this.created(res, {
      filepath: req.file?.path
    });
  }
}
