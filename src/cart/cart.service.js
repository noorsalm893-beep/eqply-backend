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
var __param =
  (this && this.__param) ||
  function (paramIndex, decorator) {
    return function (target, key) {
      decorator(target, key, paramIndex);
    };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.CartService = void 0;
const common_1 = require('@nestjs/common');
const mongoose_1 = require('@nestjs/mongoose');
const mongoose_2 = require('mongoose');
const cart_schema_1 = require('./cart.schema');
let CartService = class CartService {
  cartModel;
  constructor(cartModel) {
    this.cartModel = cartModel;
  }
  getModelOrThrow() {
    if (!this.cartModel) {
      throw new common_1.ServiceUnavailableException(
        'Database is currently disabled or unavailable',
      );
    }
    return this.cartModel;
  }
  async create(createCartData) {
    const model = this.getModelOrThrow();
    const cart = new model(createCartData);
    return cart.save();
  }
  async findById(id) {
    return this.getModelOrThrow().findById(id).exec();
  }
  async findByUserId(userId) {
    return this.getModelOrThrow().findOne({ userId }).populate('items.productId').exec();
  }
  async updateByUserId(userId, updateData) {
    return this.getModelOrThrow().findOneAndUpdate(
      { userId },
      updateData,
      { new: true }
    ).exec();
  }
  async addItem(userId, productId, quantity = 1) {
    const model = this.getModelOrThrow();

    // Try to increment quantity if the item already exists in the cart
    const updatedCart = await model.findOneAndUpdate(
      { userId, 'items.productId': productId },
      { $inc: { 'items.$.quantity': quantity } },
      { new: true }
    ).exec();

    if (updatedCart) return updatedCart;

    // If not found, check if the cart exists
    const cart = await model.findOne({ userId });
    if (cart) {
      // Cart exists but item doesn't, so push new item
      return model.findOneAndUpdate(
        { userId },
        { $push: { items: { productId, quantity } } },
        { new: true }
      ).exec();
    } else {
      // Cart doesn't exist, create new one
      return this.create({
        userId,
        items: [{ productId, quantity }],
      });
    }
  }
  async removeItem(userId, productId) {
    return this.getModelOrThrow().findOneAndUpdate(
      { userId },
      { $pull: { items: { productId } } },
      { new: true }
    ).exec();
  }
  async clearCart(userId) {
    return this.getModelOrThrow().findOneAndUpdate(
      { userId },
      { items: [] },
      { new: true }
    ).exec();
  }
};
exports.CartService = CartService = __decorate(
  [
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(cart_schema_1.Cart.name), (0, common_1.Optional)()),
    __metadata('design:paramtypes', [mongoose_2.Model]),
  ],
  CartService,
);
//# sourceMappingURL=cart.service.js.map