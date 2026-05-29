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
exports.OrderSummaryDto = void 0;
const swagger_1 = require('@nestjs/swagger');
const order_item_dto_1 = require('./order-item.dto');

class OrderSummaryDto {
  _id;
  status;
  total;
  createdAt;
  items;
}
exports.OrderSummaryDto = OrderSummaryDto;

__decorate(
  [
    (0, swagger_1.ApiProperty)({ example: '507f1f77bcf86cd799439011' }),
    __metadata('design:type', String),
  ],
  OrderSummaryDto.prototype,
  '_id',
  void 0,
);
__decorate(
  [
    (0, swagger_1.ApiProperty)({
      enum: ['pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled'],
      example: 'pending',
    }),
    __metadata('design:type', String),
  ],
  OrderSummaryDto.prototype,
  'status',
  void 0,
);
__decorate(
  [
    (0, swagger_1.ApiProperty)({ example: 199.98 }),
    __metadata('design:type', Number),
  ],
  OrderSummaryDto.prototype,
  'total',
  void 0,
);
__decorate(
  [
    (0, swagger_1.ApiProperty)({ example: '2026-05-29T12:00:00.000Z' }),
    __metadata('design:type', Date),
  ],
  OrderSummaryDto.prototype,
  'createdAt',
  void 0,
);
__decorate(
  [
    (0, swagger_1.ApiProperty)({ type: [order_item_dto_1.OrderItemDto] }),
    __metadata('design:type', Array),
  ],
  OrderSummaryDto.prototype,
  'items',
  void 0,
);
