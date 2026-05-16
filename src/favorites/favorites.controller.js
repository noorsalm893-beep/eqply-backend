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
exports.FavoritesController = void 0;
const common_1 = require('@nestjs/common');
const swagger_1 = require('@nestjs/swagger');
const favorites_service_1 = require('./favorites.service');
const jwt_auth_guard_1 = require('../common/guards/jwt-auth.guard');
const current_user_decorator_1 = require('../common/decorators/current-user.decorator');
const toggle_favorite_dto_1 = require('./dto/toggle-favorite.dto');
let FavoritesController = class FavoritesController {
  favoritesService;
  constructor(favoritesService) {
    this.favoritesService = favoritesService;
  }
  toggleFavorite(user, toggleFavoriteDto) {
    const { productId } = toggleFavoriteDto;
    return this.favoritesService.findByUserIdAndProductId(user._id, productId)
      .then(existing => {
        if (existing) {
          return this.favoritesService.remove(user._id, productId);
        } else {
          return this.favoritesService.create({
            userId: user._id,
            productId,
          });
        }
      });
  }
  getFavorites(user) {
    return this.favoritesService.findByUserId(user._id);
  }
};
exports.FavoritesController = FavoritesController = __decorate(
  [
    (0, common_1.Controller)('favorites'),
    (0, swagger_1.ApiTags)('favorites'),
  ],
  FavoritesController,
);
__decorate(
  [
    (0, common_1.Post)('toggle'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', [
      Object,
      toggle_favorite_dto_1.ToggleFavoriteDto,
    ]),
    __metadata('design:returntype', Promise),
  ],
  FavoritesController.prototype,
  'toggleFavorite',
  null,
);
__decorate(
  [
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', [Object]),
    __metadata('design:returntype', Promise),
  ],
  FavoritesController.prototype,
  'getFavorites',
  null,
);