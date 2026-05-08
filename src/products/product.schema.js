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
exports.ProductSchema = exports.Product = void 0;
const mongoose_1 = require('@nestjs/mongoose');
const mongoose_2 = require('mongoose');
let Product = class Product {
  constructor() {
    this.rentAvailable = false;
    this.buyAvailable = false;
    this.rentOptions = [];
    this.liked = false;
    this.bestDeal = false;
  }
};
__decorate([
  (0, mongoose_1.Prop)({ required: true }),
  __metadata('design:type', String),
], Product.prototype, 'picture', void 0);
__decorate([
  (0, mongoose_1.Prop)({ required: true }),
  __metadata('design:type', String),
], Product.prototype, 'name', void 0);
__decorate([
  (0, mongoose_1.Prop)({ required: true }),
  __metadata('design:type', String),
], Product.prototype, 'description', void 0);
__decorate([
  (0, mongoose_1.Prop)({ required: true }),
  __metadata('design:type', String),
], Product.prototype, 'category', void 0);
__decorate([
  (0, mongoose_1.Prop)({ default: false }),
  __metadata('design:type', Boolean),
], Product.prototype, 'rentAvailable', void 0);
__decorate([
  (0, mongoose_1.Prop)({ default: false }),
  __metadata('design:type', Boolean),
], Product.prototype, 'buyAvailable', void 0);
__decorate([
  (0, mongoose_1.Prop)({ type: [{ duration: String, price: Number }] }),
  __metadata('design:type', Array),
], Product.prototype, 'rentOptions', void 0);
__decorate([
  (0, mongoose_1.Prop)(),
  __metadata('design:type', Number),
], Product.prototype, 'buyPrice', void 0);
__decorate([
  (0, mongoose_1.Prop)({ default: false }),
  __metadata('design:type', Boolean),
], Product.prototype, 'liked', void 0);
__decorate([
  (0, mongoose_1.Prop)({ default: false }),
  __metadata('design:type', Boolean),
], Product.prototype, 'bestDeal', void 0);
__decorate([
  (0, mongoose_1.Prop)({ type: { vendorName: String, vendorId: String } }),
  __metadata('design:type', Object),
], Product.prototype, 'vendor', void 0);
Product = __decorate(
  [
    (0, mongoose_1.Schema)({ timestamps: true }),
    __metadata('design:paramtypes', []),
  ],
  Product,
);
exports.Product = Product;
exports.ProductSchema = mongoose_1.SchemaFactory.createForClass(Product);
//# sourceMappingURL=product.schema.js.map