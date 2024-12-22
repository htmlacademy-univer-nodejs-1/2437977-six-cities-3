import {inject, injectable} from 'inversify';
import {Response, Request} from 'express';
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
import LoginUserDto from '../dto/login-user.dto.js';
import LoggedUserRdo from '../rdo/logged-user.rdo.js';
import {JWT_ALGORITHM} from '../user.constant.js';
import {createJWT} from '../../../helpers/createJWT.js';
import {UnknownRecord} from '../../../types/unknown-record.type.js';
import {Config} from '../../../config/config.interface.js';
import UploadAvatarResponse from '../rdo/upload-avatar.response.js';

@injectable()
export class UserController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.UserService) private readonly userService: UserService,
    @inject(Component.Config) protected readonly configService: Config<RestSchema>,
  ) {
    super(logger, configService);
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
    this.addRoute({
      path: '/login',
      method: HttpMethod.Get,
      handler: this.checkAuthenticate,
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
    {body}: Request<UnknownRecord, UnknownRecord, LoginUserDto>,
    res: Response,
  ): Promise<void> {
    const user = await this
      .userService
      .verifyUser(body, this.configService.get('SALT'));

    if (!user) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        'Unauthorized',
        'UserController',
      );
    }

    const token = await createJWT(
      JWT_ALGORITHM,
      this.configService.get('JWT_SECRET'),
      {
        email: user.email,
        id: user.id
      }
    );

    this.ok(res, {
      ...fillDTO(LoggedUserRdo, user),
      token
    });
  }

  public async uploadAvatar(req: Request, res: Response) {
    const {userId} = req.params;
    const uploadFile = {avatar: req.file?.filename};

    await this.userService.updateById(userId, uploadFile);
    this.created(res, fillDTO(UploadAvatarResponse, uploadFile));
  }

  public async checkAuthenticate({user: {email}}: Request, res: Response) {
    const foundedUser = await this.userService.findByEmail(email);

    if (!foundedUser) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        'Unauthorized',
        'UserController'
      );
    }

    this.ok(res, fillDTO(LoggedUserRdo, foundedUser));
  }
}
