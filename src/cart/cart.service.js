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
    const cart = await this.findByUserId(userId);
    if (cart) {
      // Check if item already exists in cart
      const existingItemIndex = cart.items.findIndex(
        item => item.productId.toString() === productId
      );
      if (existingItemIndex >= 0) {
        // Update quantity
        cart.items[existingItemIndex].quantity += quantity;
        return this.getModelOrThrow().findOneAndUpdate(
          { userId },
          { items: cart.items, updatedAt: new Date() },
          { new: true }
        ).exec();
      } else {
        // Add new item
        cart.items.push({ productId, quantity });
        return this.getModelOrThrow().findOneAndUpdate(
          { userId },
          { items: cart.items, updatedAt: new Date() },
          { new: true }
        ).exec();
      }
    } else {
      // Create new cart
      const newCart = await this.create({
        userId,
        items: [{ productId, quantity }],
      });
      return newCart;
    }
  }
  async removeItem(userId, productId) {
    const cart = await this.findByUserId(userId);
    if (cart) {
      // Remove item from cart
      cart.items = cart.items.filter(
        item => item.productId.toString() !== productId
      );
      return this.getModelOrThrow().findOneAndUpdate(
        { userId },
        { items: cart.items, updatedAt: new Date() },
        { new: true }
      ).exec();
    }
    return null;
  }
  async clearCart(userId) {
    return this.getModelOrThrow().findOneAndUpdate(
      { userId },
      { items: [], updatedAt: new Date() },
      { new: true }
    ).exec();
  }
};
exports.CartService = CartService = __decorate(
  [
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(cart_schema_1.Cart.name)),
    __param(0, (0, common_1.Optional)()),
    __metadata('design:paramtypes', [mongoose_2.Model]),
  ],
  CartService,
);
//# sourceMappingURL=cart.service.js.map