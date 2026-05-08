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
exports.ReviewsService = void 0;
const common_1 = require('@nestjs/common');
const mongoose_1 = require('@nestjs/mongoose');
const mongoose_2 = require('mongoose');
const review_schema_1 = require('./review.schema');
let ReviewsService = class ReviewsService {
  reviewModel;
  constructor(reviewModel) {
    this.reviewModel = reviewModel;
  }
  getModelOrThrow() {
    if (!this.reviewModel) {
      throw new common_1.ServiceUnavailableException(
        'Database is currently disabled or unavailable',
      );
    }
    return this.reviewModel;
  }
  async create(createReviewData) {
    const model = this.getModelOrThrow();
    const review = new model(createReviewData);
    return review.save();
  }
  async findById(id) {
    return this.getModelOrThrow().findById(id).exec();
  }
  async findByUserId(userId) {
    return this.getModelOrThrow().find({ userId }).exec();
  }
  async findByProductId(productId) {
    return this.getModelOrThrow().find({ productId }).exec();
  }
  async findRecent(limit = 3) {
    return this.getModelOrThrow()
      .find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate('userId', 'name email')
      .exec();
  }
  async delete(id) {
    return this.getModelOrThrow().findByIdAndDelete(id).exec();
  }
};
exports.ReviewsService = ReviewsService = __decorate(
  [
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(review_schema_1.Review.name)),
    __param(0, (0, common_1.Optional)()),
    __metadata('design:paramtypes', [mongoose_2.Model]),
  ],
  ReviewsService,
);
//# sourceMappingURL=reviews.service.js.map