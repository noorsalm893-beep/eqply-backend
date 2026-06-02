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
exports.ProductsController = void 0;
const common_1 = require('@nestjs/common');
const swagger_1 = require('@nestjs/swagger');
const products_service_1 = require('./products.service');
const jwt_auth_guard_1 = require('../common/guards/jwt-auth.guard');
const current_user_decorator_1 = require('../common/decorators/current-user.decorator');
const query_products_dto_1 = require('./dto/query-products.dto');

let ProductsController = class ProductsController {
  productsService;
  constructor(productsService) {
    this.productsService = productsService;
  }
  getBestDeals() {
    return this.productsService.getBestDeals();
  }
  // ✅ UPGRADED — accepts optional filter/sort query params
  getAllProducts(query) {
    return this.productsService.getAllProducts(query);
  }
  getCategories() {
    return this.productsService.getCategories();
  }
  searchProducts(query) {
    return this.productsService.searchProducts(query);
  }
  getMyProducts(user) {
    if (!user) {
      throw new common_1.UnauthorizedException('User not found or unauthorized');
    }
    return this.productsService.getProductsByVendor(user._id);
  }
  createProduct(user, body) {
    if (!user) {
      throw new common_1.UnauthorizedException('User not found or unauthorized');
    }
    return this.productsService.createProduct(body, user);
  }
};
exports.ProductsController = ProductsController;
__decorate(
  [
    (0, common_1.Get)('best-deals'),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', []),
    __metadata('design:returntype', void 0),
  ],
  ProductsController.prototype,
  'getBestDeals',
  null,
);
__decorate(
  [
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all products with optional filtering and sorting' }),
    (0, swagger_1.ApiQuery)({ name: 'category', required: false, description: 'Filter by category' }),
    (0, swagger_1.ApiQuery)({ name: 'type', required: false, description: 'Filter by type: Sale | Rental' }),
    (0, swagger_1.ApiQuery)({ name: 'minPrice', required: false, type: Number, description: 'Minimum price' }),
    (0, swagger_1.ApiQuery)({ name: 'maxPrice', required: false, type: Number, description: 'Maximum price' }),
    (0, swagger_1.ApiQuery)({ name: 'sort', required: false, enum: query_products_dto_1.SortOption, description: 'Sort: newest | lowest | highest' }),
    __param(0, (0, common_1.Query)()),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', [query_products_dto_1.QueryProductsDto]),
    __metadata('design:returntype', void 0),
  ],
  ProductsController.prototype,
  'getAllProducts',
  null,
);
__decorate(
  [
    (0, common_1.Get)('categories'),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', []),
    __metadata('design:returntype', void 0),
  ],
  ProductsController.prototype,
  'getCategories',
  null,
);
__decorate(
  [
    (0, common_1.Get)('search'),
    __param(0, (0, common_1.Query)('query')),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', [Object]),
    __metadata('design:returntype', void 0),
  ],
  ProductsController.prototype,
  'searchProducts',
  null,
);
__decorate(
  [
    (0, common_1.Get)('my-products'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', [Object]),
    __metadata('design:returntype', void 0),
  ],
  ProductsController.prototype,
  'getMyProducts',
  null,
);
__decorate(
  [
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', [Object, Object]),
    __metadata('design:returntype', void 0),
  ],
  ProductsController.prototype,
  'createProduct',
  null,
);
exports.ProductsController = ProductsController = __decorate(
  [
    (0, swagger_1.ApiTags)('products'),
    (0, common_1.Controller)('products'),
    __metadata('design:paramtypes', [products_service_1.ProductsService]),
  ],
  ProductsController,
);
//# sourceMappingURL=products.controller.js.map