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
    return this.getModelOrThrow().find({ bestDeal: true }).limit(4).exec();
  }

  async getAllProducts(query = {}) {
    const filter = {};

    if (query.category) {
      filter.category = query.category;
    }

    if (query.type) {
      if (query.type === 'Sale') {
        filter.buyAvailable = true;
      } else if (query.type === 'Rental') {
        filter.rentAvailable = true;
      } else {
        filter.type = query.type;
      }
    }

    if (query.minPrice !== undefined || query.maxPrice !== undefined) {
      filter.buyPrice = {};
      if (query.minPrice !== undefined) filter.buyPrice.$gte = query.minPrice;
      if (query.maxPrice !== undefined) filter.buyPrice.$lte = query.maxPrice;
    }

    let sortOption = { createdAt: -1 };
    if (query.sort === 'lowest') {
      sortOption = { buyPrice: 1 };
    } else if (query.sort === 'highest') {
      sortOption = { buyPrice: -1 };
    } else if (query.sort === 'newest') {
      sortOption = { createdAt: -1 };
    }

    return this.getModelOrThrow().find(filter).sort(sortOption).exec();
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
          { description: { $regex: query, $options: 'i' } },
        ],
      })
      .exec();
  }

  async getProductsByVendor(vendorId) {
    return this.getModelOrThrow().find({ 'vendor.vendorId': vendorId }).exec();
  }

  async createProduct(createProductDto, user) {
    // ✅ Validate that picture is a Base64 string
    if (!createProductDto.picture) {
      throw new common_1.BadRequestException('picture is required');
    }
    if (!createProductDto.picture.startsWith('data:image/')) {
      throw new common_1.BadRequestException(
        'picture must be a Base64 image string (e.g. data:image/jpeg;base64,...)',
      );
    }

    const product = new (this.getModelOrThrow())({
      picture:        createProductDto.picture,       // ✅ Full Base64 saved to MongoDB
      name:           createProductDto.name,
      description:    createProductDto.description,
      category:       createProductDto.category,
      rentAvailable:  createProductDto.rentAvailable  ?? false,
      buyAvailable:   createProductDto.buyAvailable   ?? false,
      rentOptions:    createProductDto.rentOptions    ?? [],
      buyPrice:       createProductDto.buyPrice,
      bestDeal:       false,
      liked:          false,
      vendor: {
        vendorId:   user._id.toString(),
        vendorName: user.name,
      },
    });

    try {
      return await product.save();
    } catch (err) {
      console.error('[ProductsService] createProduct error:', err);
      throw new common_1.InternalServerErrorException('Failed to save product');
    }
  }
};

exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate(
  [
    (0, common_1.Injectable)(),
    __param(
      0,
      (0, mongoose_1.InjectModel)(product_schema_1.Product.name),
      (0, common_1.Optional)(),
    ),
    __metadata('design:paramtypes', [mongoose_2.Model]),
  ],
  ProductsService,
);
//# sourceMappingURL=products.service.js.map