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
exports.OrderSchema = exports.Order = void 0;
const mongoose_1 = require('@nestjs/mongoose');
const mongoose_2 = require('mongoose');
let Order = class Order {
  constructor() {
    this.status = 'pending';
    this.totalAmount = 0;
  }
};
__decorate([
  (0, mongoose_1.Prop)({ type: mongoose_2.Schema.Types.ObjectId, ref: 'User', required: true }),
  __metadata('design:type', Object),
], Order.prototype, 'userId', void 0);
__decorate([
  (0, mongoose_1.Prop)({ type: [{ productId: { type: mongoose_2.Schema.Types.ObjectId, ref: 'Product' }, quantity: Number, price: Number }], required: true }),
  __metadata('design:type', Array),
], Order.prototype, 'items', void 0);
__decorate([
  (0, mongoose_1.Prop)({ required: true }),
  __metadata('design:type', Number),
], Order.prototype, 'totalAmount', void 0);
__decorate([
  (0, mongoose_1.Prop)({ enum: ['pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled'], default: 'pending' }),
  __metadata('design:type', String),
], Order.prototype, 'status', void 0);
__decorate([
  (0, mongoose_1.Prop)({ default: Date.now }),
  __metadata('design:type', Date),
], Order.prototype, 'createdAt', void 0);
Order = __decorate([
  (0, mongoose_1.Schema)({ timestamps: true }),
  __metadata('design:paramtypes', []),
],
Order);
exports.Order = Order;
exports.OrderSchema = mongoose_1.SchemaFactory.createForClass(Order);
//# sourceMappingURL=order.schema.js.map