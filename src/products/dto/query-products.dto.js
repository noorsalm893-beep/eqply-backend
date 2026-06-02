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
exports.QueryProductsDto = exports.SortOption = void 0;
const class_validator_1 = require('class-validator');
const class_transformer_1 = require('class-transformer');
const swagger_1 = require('@nestjs/swagger');

var SortOption;
(function (SortOption) {
  SortOption['NEWEST'] = 'newest';
  SortOption['LOWEST'] = 'lowest';
  SortOption['HIGHEST'] = 'highest';
})(SortOption || (exports.SortOption = SortOption = {}));

class QueryProductsDto {}
exports.QueryProductsDto = QueryProductsDto;
__decorate(
  [
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filter by category (e.g. Electronics, Books)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata('design:type', String),
  ],
  QueryProductsDto.prototype, 'category', void 0,
);
__decorate(
  [
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filter by type (e.g. Sale, Rental)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata('design:type', String),
  ],
  QueryProductsDto.prototype, 'type', void 0,
);
__decorate(
  [
    (0, swagger_1.ApiPropertyOptional)({ description: 'Minimum price', minimum: 0 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata('design:type', Number),
  ],
  QueryProductsDto.prototype, 'minPrice', void 0,
);
__decorate(
  [
    (0, swagger_1.ApiPropertyOptional)({ description: 'Maximum price', minimum: 0 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata('design:type', Number),
  ],
  QueryProductsDto.prototype, 'maxPrice', void 0,
);
__decorate(
  [
    (0, swagger_1.ApiPropertyOptional)({
      description: 'Sort order: newest | lowest | highest',
      enum: SortOption,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(SortOption),
    __metadata('design:type', String),
  ],
  QueryProductsDto.prototype, 'sort', void 0,
);