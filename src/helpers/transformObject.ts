import {UnknownRecord} from '../types/unknown-record.type.js';
import {transformProperty} from './transformProperty.js';
import {DEFAULT_STATIC_IMAGES} from '../rest/rest.constant.js';

export function transformObject(properties: string[], staticPath: string, uploadPath: string, data:UnknownRecord) {
  return properties
    .forEach((property) => {
      transformProperty(property, data, (target: UnknownRecord) => {
        const rootPath = DEFAULT_STATIC_IMAGES.includes(target[property] as string) ? staticPath : uploadPath;

        target[property] = `${rootPath}/${target[property]}`;
      });
    });
}
