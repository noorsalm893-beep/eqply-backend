'use strict';
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
  var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
  if (typeof Reflect === 'object' && typeof Reflect.decorate === 'function') r = Reflect.decorate(decorators, target, key, desc);
  else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return (c > 3 && r && Object.defineProperty(target, key, r), r);
};
var __metadata = (this && this.__metadata) || function (k, v) {
  if (typeof Reflect === 'object' && typeof Reflect.metadata === 'function') return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
  return function (target, key) { decorator(target, key, paramIndex); };
};
Object.defineProperty(exports, '__esModule', { value: true });
exports.ProductsController = void 0;
const common_1 = require('@nestjs/common');
const swagger_1 = require('@nestjs/swagger');
const platform_express_1 = require('@nestjs/platform-express');
const multer = require('multer');
const path = require('path');
const products_service_1 = require('./products.service');
const get_products_query_dto_1 = require('./dto/get-products-query.dto');
const jwt_auth_guard_1 = require('../common/guards/jwt-auth.guard');
const current_user_decorator_1 = require('../common/decorators/current-user.decorator');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads');
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueName + path.extname(file.originalname));
  },
});

const multerOptions = { storage };

let ProductsController = class ProductsController {
  productsService;
  constructor(productsService) {
    this.productsService = productsService;
  }
  getBestDeals() {
    return this.productsService.getBestDeals();
  }
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
    if (!user) throw new common_1.UnauthorizedException('User not found or unauthorized');
    return this.productsService.getProductsByVendor(user._id);
  }
  createProduct(user, file, body) {
    if (!user) throw new common_1.UnauthorizedException('User not found or unauthorized');
    const picture = file ? `/uploads/${file.filename}` : null;
    return this.productsService.createProduct({ ...body, picture }, user);
  }
};
exports.ProductsController = ProductsController;

__decorate([
  (0, common_1.Get)('best-deals'),
  __metadata('design:type', Function),
  __metadata('design:paramtypes', []),
  __metadata('design:returntype', void 0),
], ProductsController.prototype, 'getBestDeals', null);

__decorate([
  (0, common_1.Get)(),
  (0, swagger_1.ApiOperation)({
    summary: 'List products with optional filters and sorting',
  }),
  __param(0, (0, common_1.Query)()),
  __metadata('design:type', Function),
  __metadata('design:paramtypes', [get_products_query_dto_1.GetProductsQueryDto]),
  __metadata('design:returntype', void 0),
], ProductsController.prototype, 'getAllProducts', null);

__decorate([
  (0, common_1.Get)('categories'),
  __metadata('design:type', Function),
  __metadata('design:paramtypes', []),
  __metadata('design:returntype', void 0),
], ProductsController.prototype, 'getCategories', null);

__decorate([
  (0, common_1.Get)('search'),
  __param(0, (0, common_1.Query)('query')),
  __metadata('design:type', Function),
  __metadata('design:paramtypes', [Object]),
  __metadata('design:returntype', void 0),
], ProductsController.prototype, 'searchProducts', null);

__decorate([
  (0, common_1.Get)('my-products'),
  (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
  (0, swagger_1.ApiBearerAuth)(),
  __param(0, (0, current_user_decorator_1.CurrentUser)()),
  __metadata('design:type', Function),
  __metadata('design:paramtypes', [Object]),
  __metadata('design:returntype', void 0),
], ProductsController.prototype, 'getMyProducts', null);

__decorate([
  (0, common_1.Post)(),
  (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
  (0, swagger_1.ApiBearerAuth)(),
  (0, swagger_1.ApiConsumes)('multipart/form-data'),
  (0, swagger_1.ApiBody)({
    schema: {
      type: 'object',
      properties: {
        picture: { type: 'string', format: 'binary' },
        name: { type: 'string' },
        description: { type: 'string' },
        category: { type: 'string' },
        buyPrice: { type: 'number' },
        rentAvailable: { type: 'boolean' },
        buyAvailable: { type: 'boolean' },
      },
    },
  }),
  (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('picture', multerOptions)),
  (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
  __param(0, (0, current_user_decorator_1.CurrentUser)()),
  __param(1, (0, common_1.UploadedFile)()),
  __param(2, (0, common_1.Body)()),
  __metadata('design:type', Function),
  __metadata('design:paramtypes', [Object, Object, Object]),
  __metadata('design:returntype', void 0),
], ProductsController.prototype, 'createProduct', null);

exports.ProductsController = ProductsController = __decorate([
  (0, swagger_1.ApiTags)('products'),
  (0, common_1.Controller)('products'),
  __metadata('design:paramtypes', [products_service_1.ProductsService]),
], ProductsController);