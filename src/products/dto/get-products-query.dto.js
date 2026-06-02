'use strict';
var __decorate =
  (this && this.__decorate) ||
  function (decorators, target, key, desc) {
    var c = arguments.length,
      r =
        c < 3
          ? target
          : desc === null
            ? (desc = Object.getOwnPropertyDescriptor(target, key))
            : desc,
      d;
    if (typeof Reflect === 'object' && typeof Reflect.decorate === 'function')
      r = Reflect.decorate(decorators, target, key, desc);
    else
      for (var i = decorators.length - 1; i >= 0; i--)
        if ((d = decorators[i]))
          r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return (c > 3 && r && Object.defineProperty(target, key, r), r);
  };
var __metadata =
  (this && this.__metadata) ||
  function (k, v) {
    if (typeof Reflect === 'object' && typeof Reflect.metadata === 'function')
      return Reflect.metadata(k, v);
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.GetProductsQueryDto = exports.ProductSort = exports.ProductType = void 0;
const class_transformer_1 = require('class-transformer');
const class_validator_1 = require('class-validator');
const swagger_1 = require('@nestjs/swagger');

exports.ProductType = {
  RENT: 'rent',
  BUY: 'buy',
};

exports.ProductSort = {
  NEWEST: 'newest',
  LOWEST: 'lowest',
  HIGHEST: 'highest',
};

const PRODUCT_TYPES = Object.values(exports.ProductType);
const PRODUCT_SORTS = Object.values(exports.ProductSort);

function MaxPriceGteMin(validationOptions) {
  return function (object, propertyName) {
    (0, class_validator_1.registerDecorator)({
      name: 'maxPriceGteMin',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(maxPrice, args) {
          const minPrice = args.object.minPrice;
          if (minPrice == null || maxPrice == null) return true;
          return minPrice <= maxPrice;
        },
        defaultMessage() {
          return 'maxPrice must be greater than or equal to minPrice';
        },
      },
    });
  };
}

class GetProductsQueryDto {
  category;
  type;
  minPrice;
  maxPrice;
  sort;
}
exports.GetProductsQueryDto = GetProductsQueryDto;

__decorate(
  [
    (0, swagger_1.ApiPropertyOptional)({ example: 'Electronics' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata('design:type', String),
  ],
  GetProductsQueryDto.prototype,
  'category',
  void 0,
);
__decorate(
  [
    (0, swagger_1.ApiPropertyOptional)({
      enum: PRODUCT_TYPES,
      description: 'Filter by listing type: rent or buy',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(PRODUCT_TYPES),
    (0, class_transformer_1.Transform)(({ value }) =>
      typeof value === 'string' ? value.toLowerCase() : value,
    ),
    __metadata('design:type', String),
  ],
  GetProductsQueryDto.prototype,
  'type',
  void 0,
);
__decorate(
  [
    (0, swagger_1.ApiPropertyOptional)({ example: 10, minimum: 0 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata('design:type', Number),
  ],
  GetProductsQueryDto.prototype,
  'minPrice',
  void 0,
);
__decorate(
  [
    (0, swagger_1.ApiPropertyOptional)({ example: 500, minimum: 0 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    MaxPriceGteMin(),
    __metadata('design:type', Number),
  ],
  GetProductsQueryDto.prototype,
  'maxPrice',
  void 0,
);
__decorate(
  [
    (0, swagger_1.ApiPropertyOptional)({
      enum: PRODUCT_SORTS,
      default: exports.ProductSort.NEWEST,
      description: 'Sort by newest (default), lowest price, or highest price',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(PRODUCT_SORTS),
    (0, class_transformer_1.Transform)(({ value }) =>
      typeof value === 'string' ? value.toLowerCase() : value,
    ),
    __metadata('design:type', String),
  ],
  GetProductsQueryDto.prototype,
  'sort',
  void 0,
);
