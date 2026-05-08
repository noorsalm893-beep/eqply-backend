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
    if (typeof Reflect === 'object' && typeof Reflect.decorate === 'function')
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
exports.CartController = void 0;
const common_1 = require('@nestjs/common');
const swagger_1 = require('@nestjs/swagger');
const cart_service_1 = require('./cart.service');
const jwt_auth_guard_1 = require('../common/guards/jwt-auth.guard');
const current_user_decorator_1 = require('../common/decorators/current-user.decorator');
const add_to_cart_dto_1 = require('./dto/add-to-cart.dto');
const remove_from_cart_dto_1 = require('./dto/remove-from-cart.dto');
let CartController = class CartController {
  cartService;
  constructor(cartService) {
    this.cartService = cartService;
  }
  addToCart(user, addToCartDto) {
    return this.cartService.addItem(user._id, addToCartDto.productId, addToCartDto.quantity);
  }
  removeFromCart(user, removeFromCartDto) {
    return this.cartService.removeItem(user._id, removeFromCartDto.productId);
  }
  getCart(user) {
    return this.cartService.findByUserId(user._id);
  }
  clearCart(user) {
    return this.cartService.clearCart(user._id);
  }
};
exports.CartController = CartController = __decorate(
  [
    (0, common_1.Controller)('cart'),
    (0, swagger_1.ApiTags)('cart'),
  ],
  CartController,
);
__decorate(
  [
    (0, common_1.Post)('add'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Body)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', [
      Object,
      add_to_cart_dto_1.AddToCartDto,
    ]),
    __metadata('design:returntype', Promise),
  ],
  CartController.prototype,
  'addToCart',
  null,
);
__decorate(
  [
    (0, common_1.Post)('remove'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Body)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', [
      Object,
      remove_from_cart_dto_1.RemoveFromCartDto,
    ]),
    __metadata('design:returntype', Promise),
  ],
  CartController.prototype,
  'removeFromCart',
  null,
);
__decorate(
  [
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', [Object]),
    __metadata('design:returntype', Promise),
  ],
  CartController.prototype,
  'getCart',
  null,
);
__decorate(
  [
    (0, common_1.Post)('clear'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', [Object]),
    __metadata('design:returntype', Promise),
  ],
  CartController.prototype,
  'clearCart',
  null,
);