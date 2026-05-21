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
exports.ProductsService = void 0;
const common_1 = require('@nestjs/common');
const mongoose_1 = require('@nestjs/mongoose');
const mongoose_2 = require('mongoose');
const product_schema_1 = require('./product.schema');
let ProductsService = class ProductsService {
  productModel;
  constructor(productModel) {
    this.productModel = productModel;
  }
  getModelOrThrow() {
    if (!this.productModel) {
      throw new common_1.ServiceUnavailableException(
        'Database is currently disabled or unavailable',
      );
    }
    return this.productModel;
  }
  async getBestDeals() {
    return this.getModelOrThrow()
      .find({ bestDeal: true })
      .limit(4)
      .exec();
  }
  async getAllProducts() {
    return this.getModelOrThrow().find().exec();
  }
  async getCategories() {
    return this.getModelOrThrow().distinct('category').exec();
  }
  async searchProducts(query) {
    if (!query || query.trim() === '') {
      return this.getModelOrThrow().find().exec();
    }
    return this.getModelOrThrow()
      .find({
        $or: [
          { name: { $regex: query, $options: 'i' } },
          { description: { $regex: query, $options: 'i' } }
        ]
      })
      .exec();
  }
  async getProductsByVendor(vendorId) {
    return this.getModelOrThrow().find({ 'vendor.vendorId': vendorId }).exec();
  }
  // ✅ NEW — create a product posted by a student
  async createProduct(createProductDto, user) {
    const product = new (this.getModelOrThrow())({
      picture: createProductDto.picture,
      name: createProductDto.name,
      description: createProductDto.description,
      category: createProductDto.category,
      rentAvailable: createProductDto.rentAvailable ?? false,
      buyAvailable: createProductDto.buyAvailable ?? false,
      rentOptions: createProductDto.rentOptions ?? [],
      buyPrice: createProductDto.buyPrice,
      bestDeal: false,
      liked: false,
      vendor: {
        vendorId: user._id.toString(),
        vendorName: user.name,
      },
    });
    return product.save();
  }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate(
  [
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(product_schema_1.Product.name), (0, common_1.Optional)()),
    __metadata('design:paramtypes', [mongoose_2.Model]),
  ],
  ProductsService,
);
//# sourceMappingURL=products.service.js.map
 