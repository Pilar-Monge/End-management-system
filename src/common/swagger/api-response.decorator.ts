import { applyDecorators, type Type } from '@nestjs/common';
import { ApiCreatedResponse, ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';

import {
  SuccessDataResponseDto,
  SuccessListResponseDto,
  SuccessMessageResponseDto,
} from '../dto/api-response.dto';

type ApiResponseDecoratorOptions = {
  description?: string;
};

export const ApiOkResponseMessage = (options?: ApiResponseDecoratorOptions) =>
  applyDecorators(
    ApiExtraModels(SuccessMessageResponseDto),
    ApiOkResponse(
      options?.description
        ? { description: options.description, type: SuccessMessageResponseDto }
        : { type: SuccessMessageResponseDto },
    ),
  );

export const ApiOkResponseData = <TModel extends Type<unknown>>(
  model: TModel,
  options?: ApiResponseDecoratorOptions,
) =>
  applyDecorators(
    ApiExtraModels(SuccessDataResponseDto, model),
    ApiOkResponse(
      options?.description
        ? {
            description: options.description,
            schema: {
              allOf: [
                { $ref: getSchemaPath(SuccessDataResponseDto) },
                {
                  properties: {
                    data: { $ref: getSchemaPath(model) },
                  },
                },
              ],
            },
          }
        : {
            schema: {
              allOf: [
                { $ref: getSchemaPath(SuccessDataResponseDto) },
                {
                  properties: {
                    data: { $ref: getSchemaPath(model) },
                  },
                },
              ],
            },
          },
    ),
  );

export const ApiCreatedResponseData = <TModel extends Type<unknown>>(
  model: TModel,
  options?: ApiResponseDecoratorOptions,
) =>
  applyDecorators(
    ApiExtraModels(SuccessDataResponseDto, model),
    ApiCreatedResponse(
      options?.description
        ? {
            description: options.description,
            schema: {
              allOf: [
                { $ref: getSchemaPath(SuccessDataResponseDto) },
                {
                  properties: {
                    data: { $ref: getSchemaPath(model) },
                  },
                },
              ],
            },
          }
        : {
            schema: {
              allOf: [
                { $ref: getSchemaPath(SuccessDataResponseDto) },
                {
                  properties: {
                    data: { $ref: getSchemaPath(model) },
                  },
                },
              ],
            },
          },
    ),
  );

export const ApiOkResponseList = <TModel extends Type<unknown>>(
  model: TModel,
  options?: ApiResponseDecoratorOptions,
) =>
  applyDecorators(
    ApiExtraModels(SuccessListResponseDto, model),
    ApiOkResponse(
      options?.description
        ? {
            description: options.description,
            schema: {
              allOf: [
                { $ref: getSchemaPath(SuccessListResponseDto) },
                {
                  properties: {
                    data: {
                      type: 'array',
                      items: { $ref: getSchemaPath(model) },
                    },
                  },
                },
              ],
            },
          }
        : {
            schema: {
              allOf: [
                { $ref: getSchemaPath(SuccessListResponseDto) },
                {
                  properties: {
                    data: {
                      type: 'array',
                      items: { $ref: getSchemaPath(model) },
                    },
                  },
                },
              ],
            },
          },
    ),
  );
